package com.fitzone.gymbackend.service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import com.fitzone.gymbackend.exception.BusinessException;
import com.fitzone.gymbackend.exception.ResourceInUseException;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.entity.Plan;
import com.fitzone.gymbackend.repository.PlanRepository;
import com.fitzone.gymbackend.dto.CustomerAnalyticsResponse;
import com.fitzone.gymbackend.dto.CustomerGrowthResponse;
import com.fitzone.gymbackend.dto.CustomerRequest;
import com.fitzone.gymbackend.dto.CustomerResponse;
import com.fitzone.gymbackend.dto.CustomerStatsResponse;
import com.fitzone.gymbackend.dto.PlanDistributionResponse;
import com.fitzone.gymbackend.dto.RecentCustomerResponse;
import com.fitzone.gymbackend.entity.Customer;
import com.fitzone.gymbackend.repository.CustomerRepository;
import com.fitzone.gymbackend.repository.PaymentRepository;

@Service
public class CustomerService {

	private final CustomerRepository customerRepository;
	private final PlanRepository planRepository;
	private final PaymentRepository paymentRepository;

	public CustomerService(CustomerRepository customerRepository, PlanRepository planRepository,
			PaymentRepository paymentRepository) {
		this.customerRepository = customerRepository;
		this.planRepository = planRepository;
		this.paymentRepository = paymentRepository;
	}

	public Page<CustomerResponse> getAllCustomer(int page, int size, String search, String status, Long planId) {
		Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
		Page<Customer> customers = customerRepository.searchCustomers(search, status, planId, pageable);
		return customers.map(this::customerMapToResponse);
	}

	public CustomerResponse saveCustomer(CustomerRequest c) {
		Plan plan = planRepository.findById(c.getPlanId()).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		if (customerRepository.existsByPhone(c.getPhone())) {
			throw new BusinessException("Customer phone already exists");
		}
		if (customerRepository.existsByEmail(c.getEmail())) {
			throw new BusinessException("Customer email already exists");
		}
		if (c.getExpiryDate().isBefore(c.getJoinDate())) {
			throw new BusinessException("Expiry date cannot be before join date");
		}
		if (c.getJoinDate().isAfter(LocalDate.now())) {
			throw new BusinessException("Join date cannot be in the future");
		}
		if (!Boolean.TRUE.equals(plan.getActive())) {
			throw new BusinessException("Selected plan is inactive");
		}
		Customer customer = new Customer();
		customer.setName(c.getName());
		customer.setEmail(c.getEmail());
		customer.setPhone(c.getPhone());
		customer.setJoinDate(c.getJoinDate());
		customer.setExpiryDate(c.getExpiryDate());
		customer.setStatus(c.getStatus());
		customer.setPlan(plan);
		return customerMapToResponse(customerRepository.save(customer));
	}

	public CustomerResponse updateCustomer(Long id, CustomerRequest c) {
		Customer customer = customerRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		Plan plan = planRepository.findById(c.getPlanId()).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		if (customerRepository.existsByPhoneAndIdNot(c.getPhone(), id)) {
			throw new BusinessException("Customer phone already exists");
		}
		if (customerRepository.existsByEmailAndIdNot(c.getEmail(), id)) {
			throw new BusinessException("Customer email already exists");
		}
		if (c.getExpiryDate().isBefore(c.getJoinDate())) {
			throw new BusinessException("Expiry date cannot be before join date");
		}
		if (c.getJoinDate().isAfter(LocalDate.now())) {
			throw new BusinessException("Join date cannot be in the future");
		}
		if (!Boolean.TRUE.equals(plan.getActive())) {
			throw new BusinessException("Selected plan is inactive");
		}
		customer.setName(c.getName());
		customer.setEmail(c.getEmail());
		customer.setPhone(c.getPhone());
		customer.setJoinDate(c.getJoinDate());
		customer.setExpiryDate(c.getExpiryDate());
		customer.setStatus(c.getStatus());
		customer.setPlan(plan);
		return customerMapToResponse(customerRepository.save(customer));
	}

	public void archivedCustomer(Long id) {
		if (paymentRepository.existsByCustomerId(id)) {
			throw new ResourceInUseException("Customer has payment records and cannot be deleted.");
		}
		Customer customer = customerRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		customer.setArchived(true);
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
		return customerMapToResponse(customerRepository.save(customer));
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
		return new CustomerResponse(c.getId(), c.getName(), c.getEmail(), c.getPhone(), c.getJoinDate(),
				c.getExpiryDate(), c.getStatus(), c.getPlan().getId(), c.getPlan().getName(), c.getPlan().getPrice());
	}
}
