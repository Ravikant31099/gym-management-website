package com.fitzone.gymbackend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fitzone.gymbackend.config.StorageProperties;
import com.fitzone.gymbackend.constant.CustomerConstants;
import com.fitzone.gymbackend.constant.StorageFolders;
import com.fitzone.gymbackend.dto.CustomerAnalyticsResponse;
import com.fitzone.gymbackend.dto.CustomerDetailsResponse;
import com.fitzone.gymbackend.dto.CustomerExpiryReminderResponse;
import com.fitzone.gymbackend.dto.CustomerExportResponse;
import com.fitzone.gymbackend.dto.CustomerGrowthResponse;
import com.fitzone.gymbackend.dto.CustomerImageUploadResponse;
import com.fitzone.gymbackend.dto.CustomerRequest;
import com.fitzone.gymbackend.dto.CustomerResponse;
import com.fitzone.gymbackend.dto.CustomerStatsResponse;
import com.fitzone.gymbackend.dto.CustomerUpdateRequest;
import com.fitzone.gymbackend.dto.PlanDistributionResponse;
import com.fitzone.gymbackend.dto.RecentCustomerResponse;
import com.fitzone.gymbackend.dto.RenewalRequest;
import com.fitzone.gymbackend.entity.Customer;
import com.fitzone.gymbackend.entity.Payment;
import com.fitzone.gymbackend.entity.Plan;
import com.fitzone.gymbackend.enums.ActivityType;
import com.fitzone.gymbackend.enums.CustomerActivityType;
import com.fitzone.gymbackend.exception.BusinessException;
import com.fitzone.gymbackend.exception.ResourceInUseException;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.repository.CustomerActivityLogRepository;
import com.fitzone.gymbackend.repository.CustomerRepository;
import com.fitzone.gymbackend.repository.PaymentRepository;
import com.fitzone.gymbackend.repository.PlanRepository;

import jakarta.transaction.Transactional;

@Service
public class CustomerService {

	private static final int MAX_PAGE_SIZE = 100;
	private static final int GROWTH_WINDOW_MONTHS = 12;

	private final CustomerRepository customerRepository;
	private final PlanRepository planRepository;
	private final PaymentRepository paymentRepository;
	private final StorageProperties storageProperties;
	private final CustomerActivityLogService customerActivityLogService;
	private final CustomerActivityLogRepository customerActivityLogRepository;
	private final AuditLogService auditLogService;

	@Value("${file.upload-dir}")
	private String uploadDir;

	public CustomerService(CustomerRepository customerRepository, PlanRepository planRepository,
			PaymentRepository paymentRepository, StorageProperties storageProperties,
			CustomerActivityLogService customerActivityLogService,
			CustomerActivityLogRepository customerActivityLogRepository, AuditLogService auditLogService) {
		this.customerRepository = customerRepository;
		this.planRepository = planRepository;
		this.paymentRepository = paymentRepository;
		this.storageProperties = storageProperties;
		this.customerActivityLogService = customerActivityLogService;
		this.customerActivityLogRepository = customerActivityLogRepository;
		this.auditLogService = auditLogService;
	}

	public Page<CustomerResponse> getAllCustomer(int page, int size, String sortBy, String sortDir, String search,
			String status, String membershipStatus, Long planId) {
		int safeSize = clampPageSize(size);
		int safePage = Math.max(page, 0);
		if (!CustomerConstants.ALLOWED_SORT_FIELDS.contains(sortBy)) {
			sortBy = "createdAt";
		}
		Sort sort = "asc".equalsIgnoreCase(sortDir) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		Pageable pageable = PageRequest.of(safePage, safeSize, sort);

		Page<Customer> customers;
		if ("EXPIRING".equalsIgnoreCase(status)) {
			customers = customerRepository.findExpiringCustomers(search, planId, LocalDate.now(),
					LocalDate.now().plusDays(7), pageable);
		} else if ("EXPIRED".equalsIgnoreCase(status)) {
			customers = customerRepository.findExpiredCustomers(search, planId, LocalDate.now(), pageable);
		} else {
			customers = customerRepository.searchCustomers(search, status, planId, pageable);
		}
		return customers.map(this::customerMapToResponse);
	}

	public CustomerDetailsResponse getCustomerDetails(Long id) {
		Customer customer = customerRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		CustomerDetailsResponse response = new CustomerDetailsResponse();
		response.setId(customer.getId());
		response.setName(customer.getName());
		response.setPhone(customer.getPhone());
		response.setEmail(customer.getEmail());
		response.setStatus(customer.getStatus());
		response.setJoinDate(customer.getJoinDate());
		response.setExpiryDate(customer.getExpiryDate());
		response.setPlanName(customer.getPlan() != null ? customer.getPlan().getName() : null);
		response.setPlanId(customer.getPlan() != null ? customer.getPlan().getId() : null);
		response.setProfileImageUrl(customer.getProfileImageUrl());
		response.setImageUpdatedAt(customer.getImageUpdatedAt());
		response.setImageUpdatedBy(customer.getImageUpdatedBy());
		if (customer.getExpiryDate() != null) {
			response.setDaysRemaining(
					java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), customer.getExpiryDate()));
		}
		return response;
	}

	@Transactional
	public CustomerResponse saveCustomer(CustomerRequest c) {
		Plan plan = planRepository.findById(c.getPlanId()).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		if (!Boolean.TRUE.equals(plan.getActive())) {
			throw new BusinessException("Selected plan is inactive");
		}
		validateCustomerEmailAndPhone(c.getPhone(), c.getEmail(), null);
		validateCustomerStatus(c.getStatus());
		Customer customer = new Customer();
		customer.setName(c.getName());
		customer.setEmail(c.getEmail());
		customer.setPhone(c.getPhone());
		customer.setJoinDate(c.getJoinDate());
		customer.setExpiryDate(c.getJoinDate().plusMonths(plan.getPeriod()));
		customer.setStatus(c.getStatus());
		customer.setPlan(plan);
		Customer savedCustomer = customerRepository.save(customer);
		createMembershipPayment(savedCustomer, plan, c.getPaymentMode(), c.getPaymentStatus(), c.getPaymentRemarks());
		customerActivityLogService.logActivity(savedCustomer, CustomerActivityType.CUSTOMER_CREATED,
				"Customer created");
		auditLogService.logActivity("CUSTOMER", customer.getId(), ActivityType.CUSTOMER_CREATED,
				"Customer '" + customer.getName() + "' created.");
		return customerMapToResponse(savedCustomer);
	}

	@Transactional
	public CustomerResponse updateCustomer(Long id, CustomerUpdateRequest c) {
		Customer customer = customerRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		validateCustomerEmailAndPhone(c.getPhone(), c.getEmail(), id);
		validateCustomerStatus(c.getStatus());
		customer.setName(c.getName());
		customer.setEmail(c.getEmail());
		customer.setPhone(c.getPhone());
		customer.setStatus(c.getStatus());
		Customer savedCustomer = customerRepository.save(customer);
		customerActivityLogService.logActivity(customer, CustomerActivityType.CUSTOMER_UPDATED,
				"Customer details updated");
		auditLogService.logActivity("CUSTOMER", customer.getId(), ActivityType.CUSTOMER_UPDATED,
				"Customer '" + customer.getName() + "' updated.");
		return customerMapToResponse(savedCustomer);
	}

	@Transactional
	public void archivedCustomer(Long id) {
		Customer customer = customerRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		if (Boolean.TRUE.equals(customer.getArchived())) {
			return; // already archived — idempotent, avoid duplicate activity log noise
		}
		if (paymentRepository.existsByCustomerId(id)) {
			throw new ResourceInUseException("Customer has payment records and cannot be deleted.");
		}
		customer.setArchived(true);
		customerActivityLogService.logActivity(customer, CustomerActivityType.CUSTOMER_DELETED, "Customer deleted");
		auditLogService.logActivity("CUSTOMER", customer.getId(), ActivityType.CUSTOMER_ARCHIVED,
				"Customer '" + customer.getName() + "' archived.");
		customerRepository.save(customer);
	}

	public CustomerStatsResponse getCustomerStats() {
		LocalDate today = LocalDate.now();
		LocalDate firstDayOfMonth = today.withDayOfMonth(1);
		LocalDateTime monthStart = firstDayOfMonth.atStartOfDay();
		LocalDateTime now = LocalDateTime.now();
		CustomerStatsResponse response = new CustomerStatsResponse();
		response.setTotalCustomers(customerRepository.countByArchivedFalse());
		response.setActiveCustomers(customerRepository.countActiveMembers());
		response.setInactiveCustomers(customerRepository.countByStatusAndArchivedFalse("INACTIVE"));
		response.setExpiringToday(customerRepository.countExpiringToday());
		response.setExpiringCustomers(customerRepository.countExpiringCustomers(today, today.plusDays(7)));
		response.setExpiredCustomers(customerRepository.countExpiredMembers());
		response.setNewCustomersThisMonth(customerRepository.countByJoinDateBetween(firstDayOfMonth, today));
		response.setRenewalsThisMonth(customerActivityLogRepository.countByActivityTypeAndCreatedAtBetween(
				CustomerActivityType.MEMBERSHIP_RENEWED.name(), monthStart, now));
		return response;
	}

	public CustomerAnalyticsResponse getCustomerAnalytics() {
		CustomerStatsResponse stats = getCustomerStats();
		List<PlanDistributionResponse> planDistribution = customerRepository.getPlanDistribution();
		String mostPopularPlan = customerRepository.findMostPopularPlan().stream().findFirst().orElse("-");
		List<RecentCustomerResponse> recentCustomers = customerRepository.getRecentCustomers(PageRequest.of(0, 5))
				.getContent();
		List<CustomerGrowthResponse> customerGrowth = buildCustomerGrowth();
		return new CustomerAnalyticsResponse(stats, mostPopularPlan, planDistribution, customerGrowth, recentCustomers);
	}

	private List<CustomerGrowthResponse> buildCustomerGrowth() {
		LocalDate end = LocalDate.now();
		LocalDate start = end.minusMonths(GROWTH_WINDOW_MONTHS - 1L).withDayOfMonth(1);

		List<Object[]> rows = customerRepository.findMonthlyJoinCounts(start, end);
		java.util.Map<String, Long> countsByKey = new java.util.HashMap<>();
		for (Object[] row : rows) {
			int year = ((Number) row[0]).intValue();
			int month = ((Number) row[1]).intValue();
			long count = ((Number) row[2]).longValue();
			countsByKey.put(year + "-" + month, count);
		}

		List<CustomerGrowthResponse> result = new ArrayList<>(GROWTH_WINDOW_MONTHS);
		LocalDate cursor = start;
		for (int i = 0; i < GROWTH_WINDOW_MONTHS; i++) {
			String key = cursor.getYear() + "-" + cursor.getMonthValue();
			long count = countsByKey.getOrDefault(key, 0L);
			String label = Month.of(cursor.getMonthValue()).getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
			result.add(new CustomerGrowthResponse(label, count));
			cursor = cursor.plusMonths(1);
		}
		return result;
	}

	@Transactional
	public CustomerResponse renewMemberShip(Long customerId, RenewalRequest request) {
		Customer customer = customerRepository.findById(customerId)
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		Plan plan = planRepository.findById(request.getPlanId())
				.orElseThrow(() -> new ResourceNotFound("Plan not found"));
		if (!Boolean.TRUE.equals(plan.getActive())) {
			throw new BusinessException("Selected plan is inactive");
		}
		LocalDate today = LocalDate.now();
		LocalDate expiry = customer.getExpiryDate();
		LocalDate newExpiry = (expiry != null && expiry.isAfter(today)) ? expiry.plusMonths(plan.getPeriod())
				: today.plusMonths(plan.getPeriod());
		customer.setExpiryDate(newExpiry);
		customer.setStatus(CustomerConstants.ACTIVE);
		customer.setPlan(plan);
		Customer savedCustomer = customerRepository.save(customer);
		createMembershipPayment(customer, plan, request.getPaymentMode(), request.getPaymentStatus(),
				request.getPaymentRemarks());
		customerActivityLogService.logActivity(customer, CustomerActivityType.MEMBERSHIP_RENEWED, "Membership renewed");
		auditLogService.logActivity("CUSTOMER", customer.getId(), ActivityType.MEMBERSHIP_RENEWED,
				"Membership renewed for customer '" + customer.getName() + "'.");
		return customerMapToResponse(savedCustomer);
	}

	@Transactional
	public CustomerImageUploadResponse uploadCustomerImage(Long customerId, MultipartFile file) throws IOException {
		Customer customer = customerRepository.findById(customerId)
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));

		validateImageFile(file);

		Path uploadPath = Paths.get(storageProperties.getRootPath(), StorageFolders.CUSTOMER_IMAGES).normalize();
		if (!Files.exists(uploadPath)) {
			Files.createDirectories(uploadPath);
		}

		String extension = safeExtension(file.getOriginalFilename());
		String fileName = "customer-" + customerId + extension;
		Path filePath = uploadPath.resolve(fileName).normalize();
		if (!filePath.startsWith(uploadPath)) {
			throw new BusinessException("Invalid file path");
		}
		Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

		String imageUrl = "/customer-images/" + fileName;
		customer.setProfileImageUrl(imageUrl);
		customer.setImageUpdatedAt(LocalDateTime.now());
		String username = currentUsername();
		customer.setImageUpdatedBy(username);
		customerActivityLogService.logActivity(customer, CustomerActivityType.PROFILE_IMAGE_UPLOADED,
				"Profile image uploaded");
		auditLogService.logActivity("CUSTOMER", customer.getId(), ActivityType.CUSTOMER_PROFILE_UPLOADED,
				"Customer '" + customer.getName() + "' image uploaded.");
		customerRepository.save(customer);
		return new CustomerImageUploadResponse(customer.getId(), customer.getName(), imageUrl, LocalDateTime.now(),
				username, "Customer image uploaded successfully");
	}

	public List<CustomerExpiryReminderResponse> getExpiringSoonCustomers() {
		LocalDate today = LocalDate.now();
		LocalDate nextWeek = today.plusDays(7);
		List<Customer> customers = customerRepository.findByExpiryDateBetween(today, nextWeek);
		return customers.stream().map(customer -> {
			CustomerExpiryReminderResponse response = new CustomerExpiryReminderResponse();
			response.setId(customer.getId());
			response.setName(customer.getName());
			response.setPhone(customer.getPhone());
			response.setPlanName(customer.getPlan() != null ? customer.getPlan().getName() : null);
			response.setExpiryDate(customer.getExpiryDate());
			response.setDaysRemaining(java.time.temporal.ChronoUnit.DAYS.between(today, customer.getExpiryDate()));
			return response;
		}).toList();
	}

	public List<CustomerExportResponse> exportCustomers(String search, String status, Long planId) {
		List<Customer> customers;
		if ("EXPIRING".equalsIgnoreCase(status)) {
			customers = customerRepository.findExpiringCustomers(search, planId, LocalDate.now(),
					LocalDate.now().plusDays(7), Pageable.unpaged()).getContent();
		} else if ("EXPIRED".equalsIgnoreCase(status)) {
			customers = customerRepository.findExpiredCustomers(search, planId, LocalDate.now(), Pageable.unpaged())
					.getContent();
		} else {
			customers = customerRepository.searchCustomers(search, status, planId, Pageable.unpaged()).getContent();
		}
		return customers.stream().map(c -> {
			CustomerExportResponse response = new CustomerExportResponse();
			response.setId(c.getId());
			response.setName(c.getName());
			response.setEmail(c.getEmail());
			response.setPhone(c.getPhone());
			response.setPlanName(c.getPlan() != null ? c.getPlan().getName() : "-");
			response.setStatus(c.getStatus());
			response.setJoinDate(c.getJoinDate() != null ? c.getJoinDate().toString() : "");
			response.setExpiryDate(c.getExpiryDate() != null ? c.getExpiryDate().toString() : "");
			long daysRemaining = c.getExpiryDate() != null
					? java.time.temporal.ChronoUnit.DAYS.between(LocalDate.now(), c.getExpiryDate())
					: 0;
			response.setDaysRemaining(daysRemaining);
			return response;
		}).toList();
	}

	private CustomerResponse customerMapToResponse(Customer c) {
		Plan plan = c.getPlan();
		return new CustomerResponse(c.getId(), c.getProfileImageUrl(), c.getName(), c.getEmail(), c.getPhone(),
				c.getJoinDate(), c.getExpiryDate(), c.getStatus(), plan != null ? plan.getId() : null,
				plan != null ? plan.getName() : null, plan != null ? plan.getPrice() : null);
	}

	private void validateCustomerStatus(String status) {
		if (status == null || !List.of(CustomerConstants.ACTIVE, CustomerConstants.INACTIVE)
				.contains(status.toUpperCase(Locale.ROOT))) {
			throw new BusinessException("Invalid customer status");
		}
	}

	private void validateCustomerEmailAndPhone(String phone, String email, Long excludeId) {
		boolean phoneExists = excludeId == null ? customerRepository.existsByPhone(phone)
				: customerRepository.existsByPhoneAndIdNot(phone, excludeId);
		if (phoneExists) {
			throw new BusinessException("Customer phone already exists");
		}
		boolean emailExists = excludeId == null ? customerRepository.existsByEmail(email)
				: customerRepository.existsByEmailAndIdNot(email, excludeId);
		if (emailExists) {
			throw new BusinessException("Customer email already exists");
		}
	}

	private void createMembershipPayment(Customer customer, Plan plan, String paymentMode, String paymentStatus,
			String paymentRemarks) {
		Payment payment = new Payment();
		payment.setCustomer(customer);
		payment.setPlan(plan);
		payment.setAmount(plan.getPrice());
		payment.setPaymentDate(LocalDate.now());
		payment.setPaymentMode(paymentMode);
		payment.setStatus(paymentStatus);
		payment.setRemarks(paymentRemarks);
		paymentRepository.save(payment);
	}

	private void validateImageFile(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new BusinessException("Image file is required");
		}
		if (file.getSize() > StorageFolders.MAX_IMAGE_SIZE_BYTES) {
			throw new BusinessException("Image exceeds the maximum allowed size of 5MB");
		}
		String contentType = file.getContentType();
		if (contentType == null || !contentType.startsWith("image/")) {
			throw new BusinessException("Only image files are allowed");
		}
		String extension = safeExtension(file.getOriginalFilename());
		if (!StorageFolders.ALLOWED_IMAGE_EXTENSIONS.contains(extension)) {
			throw new BusinessException("Unsupported image type. Allowed types: "
					+ String.join(", ", StorageFolders.ALLOWED_IMAGE_EXTENSIONS));
		}
	}

	private String safeExtension(String originalFilename) {
		if (originalFilename == null || originalFilename.isBlank()) {
			return "";
		}
		String sanitized = Paths.get(originalFilename).getFileName().toString();
		int dotIndex = sanitized.lastIndexOf('.');
		if (dotIndex < 0 || dotIndex == sanitized.length() - 1) {
			return "";
		}
		return sanitized.substring(dotIndex).toLowerCase(Locale.ROOT);
	}

	private String currentUsername() {
		var authentication = SecurityContextHolder.getContext().getAuthentication();
		return authentication != null ? authentication.getName() : "SYSTEM";
	}

	private int clampPageSize(int size) {
		if (size <= 0) {
			return 10;
		}
		return Math.min(size, MAX_PAGE_SIZE);
	}
}