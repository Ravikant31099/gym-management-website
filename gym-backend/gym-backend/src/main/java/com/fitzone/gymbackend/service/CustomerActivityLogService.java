package com.fitzone.gymbackend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fitzone.gymbackend.entity.Customer;
import com.fitzone.gymbackend.entity.CustomerActivityLog;
import com.fitzone.gymbackend.enums.CustomerActivityType;
import com.fitzone.gymbackend.repository.CustomerActivityLogRepository;
import com.fitzone.gymbackend.dto.CustomerActivityResponse;

@Service
public class CustomerActivityLogService {

	private final CustomerActivityLogRepository repository;

	public CustomerActivityLogService(CustomerActivityLogRepository repository) {
		this.repository = repository;
	}

	public void logActivity(Customer customer, CustomerActivityType type, String description, String performedBy) {
		CustomerActivityLog log = new CustomerActivityLog();
		log.setCustomer(customer);
		log.setActivityType(type.name());
		log.setDescription(description);
		log.setPerformedBy(performedBy);
		repository.save(log);
	}

	public List<CustomerActivityResponse> getCustomerActivities(Long customerId) {

		List<CustomerActivityLog> logs = repository.findByCustomerIdOrderByCreatedAtDesc(customerId);

		return logs.stream().map(log -> {
			CustomerActivityResponse response = new CustomerActivityResponse();
			response.setActivityType(log.getActivityType());
			response.setDescription(log.getDescription());
			response.setPerformedBy(log.getPerformedBy());
			response.setCreatedAt(log.getCreatedAt());
			return response;
		}).toList();
	}
}
