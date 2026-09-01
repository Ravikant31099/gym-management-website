package com.fitzone.gymbackend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fitzone.gymbackend.dto.CustomerExpiryReminderResponse;
import com.fitzone.gymbackend.dto.CustomerStatsResponse;
import com.fitzone.gymbackend.dto.DashboardResponse;

@Service
public class DashboardService {

	private final CustomerService customerService;

	public DashboardService(CustomerService customerService) {
		this.customerService = customerService;
	}

	public DashboardResponse getDashboard() {
		CustomerStatsResponse customerStats = customerService.getCustomerStats();
		List<CustomerExpiryReminderResponse> expiringCustomers = customerService.getExpiringSoonCustomers();
		return new DashboardResponse(customerStats, expiringCustomers);
	}
}