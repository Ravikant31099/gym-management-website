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
import com.fitzone.gymbackend.enums.CustomerActivityType;
import com.fitzone.gymbackend.repository.PlanRepository;
import com.fitzone.gymbackend.constant.CustomerConstants;
import com.fitzone.gymbackend.dto.CustomerAnalyticsResponse;
import com.fitzone.gymbackend.dto.CustomerDetailsResponse;
import com.fitzone.gymbackend.dto.CustomerGrowthResponse;
import com.fitzone.gymbackend.dto.CustomerRequest;
import com.fitzone.gymbackend.dto.CustomerResponse;
import com.fitzone.gymbackend.dto.CustomerStatsResponse;
import com.fitzone.gymbackend.dto.PlanDistributionResponse;
import com.fitzone.gymbackend.dto.CustomerImageUploadResponse;
import com.fitzone.gymbackend.dto.RecentCustomerResponse;
import com.fitzone.gymbackend.entity.Customer;
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

	@Value("${file.upload-dir}")
	private String uploadDir;

	private static final List<String> ALLOWED_SORT_FIELDS = List.of("name", "expiryDate", "status", "plan");

	public CustomerService(CustomerRepository customerRepository, PlanRepository planRepository,
			PaymentRepository paymentRepository, StorageProperties storageProperties,
			CustomerActivityLogService customerActivityLogService) {
		this.customerRepository = customerRepository;
		this.planRepository = planRepository;
		this.paymentRepository = paymentRepository;
		this.storageProperties = storageProperties;
		this.customerActivityLogService = customerActivityLogService;
	}

	public Page<CustomerResponse> getAllCustomer(int page, int size, String sortBy, String sortDir, String search,
			String status, String membershipStatus, Long planId) {
		if (!ALLOWED_SORT_FIELDS.contains(sortBy)) {
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

	public CustomerResponse saveCustomer(CustomerRequest c) {
		Plan plan = planRepository.findById(c.getPlanId()).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		if (!Boolean.TRUE.equals(plan.getActive())) {
			throw new BusinessException("Selected plan is inactive");
		}
		validCustomerEmailAndPhone(c, null);
		validCustomerDates(c);
		validateCustomerStatus(c.getStatus());
		Customer customer = new Customer();
		customer.setName(c.getName());
		customer.setEmail(c.getEmail());
		customer.setPhone(c.getPhone());
		customer.setJoinDate(c.getJoinDate());
		customer.setExpiryDate(c.getExpiryDate());
		customer.setStatus(c.getStatus());
		customer.setPlan(plan);
		Customer savedCustomer = customerRepository.save(customer);
		customerActivityLogService.logActivity(savedCustomer, CustomerActivityType.CUSTOMER_CREATED,
				"Customer created");
		return customerMapToResponse(savedCustomer);
	}

	public CustomerResponse updateCustomer(Long id, CustomerRequest c) {
		Customer customer = customerRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		Plan plan = planRepository.findById(c.getPlanId()).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		if (!Boolean.TRUE.equals(plan.getActive())) {
			throw new BusinessException("Selected plan is inactive");
		}
		validCustomerEmailAndPhone(c, id);
		validCustomerDates(c);
		validateCustomerStatus(c.getStatus());
		customer.setName(c.getName());
		customer.setEmail(c.getEmail());
		customer.setPhone(c.getPhone());
		customer.setJoinDate(c.getJoinDate());
		customer.setExpiryDate(c.getExpiryDate());
		customer.setStatus(c.getStatus());
		customer.setPlan(plan);
		Customer savedCustomer = customerRepository.save(customer);
		customerActivityLogService.logActivity(customer, CustomerActivityType.CUSTOMER_UPDATED,
				"Customer details updated");
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
		customerRepository.save(customer);
	}

	public CustomerStatsResponse getCustomerStats() {
		Long totalCustomers = customerRepository.countByArchivedFalse();
		Long activeCustomers = customerRepository.countByStatusAndArchivedFalse("ACTIVE");
		Long expiredCustomers = customerRepository.countByStatusAndArchivedFalse("EXPIRED");
		Long inactiveCustomers = customerRepository.countByStatusAndArchivedFalse("INACTIVE");
		Long expiringCustomers = customerRepository.countExpiringCustomers(LocalDate.now(),
				LocalDate.now().plusDays(7));
		return new CustomerStatsResponse(totalCustomers, activeCustomers, expiredCustomers, expiringCustomers,
				inactiveCustomers);
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

	public CustomerResponse renewMemberShip(Long customerId, Long planId) {
		Customer customer = customerRepository.findById(customerId)
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		Plan plan = planRepository.findById(planId).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		int months = getPlanMonths(plan.getPeriod());
		LocalDate today = LocalDate.now();
		LocalDate expiry = customer.getExpiryDate();
		LocalDate newExpiry = (expiry != null && expiry.isAfter(today)) ? expiry.plusMonths(months)
				: today.plusMonths(months);
		customer.setExpiryDate(newExpiry);
		customer.setPlan(plan);
		Customer savedCustomer = customerRepository.save(customer);
		customerActivityLogService.logActivity(customer, CustomerActivityType.MEMBERSHIP_RENEWED, "Membership renewed");
		return customerMapToResponse(savedCustomer);
	}

	private int getPlanMonths(String period) {
		if (period == null)
			throw new IllegalArgumentException("Plan period is null");
		return switch (period.toLowerCase().trim().replace("/", "")) {
		case "month" -> 1;
		case "3 month" -> 3;
		case "6 month" -> 6;
		case "9 month" -> 9;
		case "year" -> 12;
		default -> throw new IllegalArgumentException("Invalid plan period: " + period);
		};
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

	private void validCustomerDates(CustomerRequest c) {
		if (c.getExpiryDate().isBefore(c.getJoinDate())) {
			throw new BusinessException("Expiry date cannot be before join date");
		}
		if (c.getJoinDate().isAfter(LocalDate.now())) {
			throw new BusinessException("Join date cannot be in the future");
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
		customerRepository.save(customer);
		return new CustomerImageUploadResponse(customer.getId(), customer.getName(), imageUrl, LocalDateTime.now(),
				username, "Customer image uploaded successfully");
	}
}
