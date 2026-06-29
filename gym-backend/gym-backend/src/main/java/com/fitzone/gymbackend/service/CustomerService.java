package com.fitzone.gymbackend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.fitzone.gymbackend.exception.BusinessException;
import com.fitzone.gymbackend.exception.ResourceInUseException;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.entity.Plan;
import com.fitzone.gymbackend.enums.ActivityType;
import com.fitzone.gymbackend.enums.CustomerActivityType;
import com.fitzone.gymbackend.repository.PlanRepository;
import jakarta.transaction.Transactional;
import com.fitzone.gymbackend.constant.CustomerConstants;
import com.fitzone.gymbackend.dto.CustomerAnalyticsResponse;
import com.fitzone.gymbackend.dto.CustomerDetailsResponse;
import com.fitzone.gymbackend.dto.CustomerExpiryReminderResponse;
import com.fitzone.gymbackend.dto.CustomerExportResponse;
import com.fitzone.gymbackend.dto.CustomerGrowthResponse;
import com.fitzone.gymbackend.dto.CustomerRequest;
import com.fitzone.gymbackend.dto.CustomerResponse;
import com.fitzone.gymbackend.dto.CustomerStatsResponse;
import com.fitzone.gymbackend.dto.CustomerUpdateRequest;
import com.fitzone.gymbackend.dto.PlanDistributionResponse;
import com.fitzone.gymbackend.dto.CustomerImageUploadResponse;
import com.fitzone.gymbackend.dto.RecentCustomerResponse;
import com.fitzone.gymbackend.dto.RenewalRequest;
import com.fitzone.gymbackend.entity.Customer;
import com.fitzone.gymbackend.entity.Payment;
import com.fitzone.gymbackend.repository.CustomerActivityLogRepository;
import com.fitzone.gymbackend.repository.CustomerRepository;
import com.fitzone.gymbackend.repository.PaymentRepository;
import com.fitzone.gymbackend.constant.StorageFolders;
import com.fitzone.gymbackend.config.StorageProperties;

@Service
public class CustomerService {

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
		if (!CustomerConstants.ALLOWED_SORT_FIELDS.contains(sortBy)) {
			sortBy = "createdAt";
		}
		Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		Pageable pageable = PageRequest.of(page, size, sort);
		String dbStatus = status;
		if ("EXPIRING".equalsIgnoreCase(status) || "EXPIRED".equalsIgnoreCase(status)) {
			dbStatus = null;
		}
		Page<Customer> customers = customerRepository.searchCustomers(search, dbStatus, planId, pageable);
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
			response.setDaysRemaining(ChronoUnit.DAYS.between(LocalDate.now(), customer.getExpiryDate()));
		}
		return response;
	}

	@Transactional
	public CustomerResponse saveCustomer(CustomerRequest c) {
		Plan plan = planRepository.findById(c.getPlanId()).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		if (!Boolean.TRUE.equals(plan.getActive())) {
			throw new BusinessException("Selected plan is inactive");
		}
		validCustomerEmailAndPhone(c, null);
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

	public CustomerResponse updateCustomer(Long id, CustomerUpdateRequest c) {
		Customer customer = customerRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		validCustomerEmailAndPhoneForUpdate(c, id);
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

	public void archivedCustomer(Long id) {
		if (paymentRepository.existsByCustomerId(id)) {
			throw new ResourceInUseException("Customer has payment records and cannot be deleted.");
		}
		Customer customer = customerRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
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
		List<Customer> customers = customerRepository.findByArchivedFalse();
		Map<Object, Long> growthMap = customers.stream()
				.collect(Collectors.groupingBy(
						customer -> customer.getJoinDate().getMonth().getDisplayName(TextStyle.SHORT, Locale.ENGLISH),
						Collectors.counting()));
		List<String> monthOrder = List.of("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov",
				"Dec");
		return growthMap.entrySet().stream().sorted(Comparator.comparingInt(e -> monthOrder.indexOf(e.getKey())))
				.map(e -> new CustomerGrowthResponse((String) e.getKey(), e.getValue())).toList();
	}

	public CustomerResponse renewMemberShip(Long customerId, RenewalRequest request) {
		Customer customer = customerRepository.findById(customerId)
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		Plan plan = planRepository.findById(request.getPlanId())
				.orElseThrow(() -> new ResourceNotFound("Plan not found"));
		LocalDate today = LocalDate.now();
		LocalDate expiry = customer.getExpiryDate();
		LocalDate newExpiry = (expiry != null && expiry.isAfter(today)) ? expiry.plusMonths(plan.getPeriod())
				: today.plusMonths(plan.getPeriod());
		customer.setExpiryDate(newExpiry);
		customer.setPlan(plan);
		Customer savedCustomer = customerRepository.save(customer);
		createMembershipPayment(customer, plan, request.getPaymentMode(), request.getPaymentStatus(),
				request.getPaymentRemarks());
		customerActivityLogService.logActivity(customer, CustomerActivityType.MEMBERSHIP_RENEWED, "Membership renewed");
		auditLogService.logActivity("CUSTOMER", customer.getId(), ActivityType.MEMBERSHIP_RENEWED,
				"Membership renewed for customer '" + customer.getName() + "'.");
		return customerMapToResponse(savedCustomer);
	}

	public CustomerImageUploadResponse uploadCustomerImage(Long customerId, MultipartFile file) throws IOException {
		Customer customer = customerRepository.findById(customerId)
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		if (file.isEmpty()) {
			throw new BusinessException("Image file is required");
		}
		String contentType = file.getContentType();
		if (contentType == null || !contentType.startsWith("image/")) {
			throw new BusinessException("Only image files are allowed");
		}
		Path uploadPath = Paths.get(storageProperties.getRootPath(), StorageFolders.CUSTOMER_IMAGES);
		if (!Files.exists(uploadPath)) {
			Files.createDirectories(uploadPath);
		}
		String extension = Objects.requireNonNull(file.getOriginalFilename())
				.substring(file.getOriginalFilename().lastIndexOf("."));
		String fileName = "customer-" + customerId + extension;
		Path filePath = uploadPath.resolve(fileName);
		Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
		String imageUrl = "/customer-images/" + fileName;
		customer.setProfileImageUrl(imageUrl);
		customer.setImageUpdatedAt(LocalDateTime.now());
		String username = SecurityContextHolder.getContext().getAuthentication().getName();
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
			response.setDaysRemaining(ChronoUnit.DAYS.between(today, customer.getExpiryDate()));
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
		return new CustomerResponse(c.getId(), c.getProfileImageUrl(), c.getName(), c.getEmail(), c.getPhone(),
				c.getJoinDate(), c.getExpiryDate(), c.getStatus(), c.getPlan().getId(), c.getPlan().getName(),
				c.getPlan().getPrice());
	}

	private void validateCustomerStatus(String status) {
		List<String> validStatuses = List.of(CustomerConstants.ACTIVE, CustomerConstants.INACTIVE);
		if (!validStatuses.contains(status.toUpperCase())) {
			throw new BusinessException("Invalid customer status");
		}
	}

	private void validCustomerEmailAndPhoneForUpdate(CustomerUpdateRequest c, Long id) {
		if (customerRepository.existsByPhoneAndIdNot(c.getPhone(), id)) {
			throw new BusinessException("Customer phone already exists");
		}
		if (customerRepository.existsByEmailAndIdNot(c.getEmail(), id)) {
			throw new BusinessException("Customer email already exists");
		}
	}

	private void validCustomerEmailAndPhone(CustomerRequest c, Long id) {
		if (id != null && customerRepository.existsByPhoneAndIdNot(c.getPhone(), id)) {
			throw new BusinessException("Customer phone already exists");
		}
		if (id != null && customerRepository.existsByEmailAndIdNot(c.getEmail(), id)) {
			throw new BusinessException("Customer email already exists");
		}
		if (id == null && customerRepository.existsByPhone(c.getPhone())) {
			throw new BusinessException("Customer phone already exists");
		}
		if (id == null && customerRepository.existsByEmail(c.getEmail())) {
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
}
