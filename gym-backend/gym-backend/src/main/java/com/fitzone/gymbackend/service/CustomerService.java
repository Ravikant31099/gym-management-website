package com.fitzone.gymbackend.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import com.fitzone.gymbackend.exception.BusinessException;
import com.fitzone.gymbackend.exception.ResourceInUseException;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.entity.Plan;
import com.fitzone.gymbackend.repository.PlanRepository;
import com.fitzone.gymbackend.dto.CustomerRequest;
import com.fitzone.gymbackend.dto.CustomerResponse;
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

	public List<CustomerResponse> getAllCustomer() {
		return customerRepository.findByArchivedFalse().stream().map(this::customerMapToResponse).toList();
	}

	public CustomerResponse saveCustomer(CustomerRequest c) {
		Plan plan = planRepository.findById(c.getPlanId()).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		if (customerRepository.existsByPhone(c.getPhone())) {
			throw new BusinessException("Customer phone already exists");
		}
		if (customerRepository.existsByEmail(c.getEmail())) {
			throw new BusinessException("Customer email already exists");
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
		Customer customer = customerRepository.findById(id).orElseThrow(() -> new ResourceNotFound("Customer not found"));
		customer.setArchived(true);
		customerRepository.save(customer);
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
