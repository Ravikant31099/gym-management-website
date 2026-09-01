package com.fitzone.gymbackend.dto;

import java.util.List;

public class DashboardResponse {
	private CustomerStatsResponse customerStats;
	private List<CustomerExpiryReminderResponse> expiringCustomers;

	public DashboardResponse() {
	}

	public DashboardResponse(CustomerStatsResponse customerStats,
			List<CustomerExpiryReminderResponse> expiringCustomers) {
		this.customerStats = customerStats;
		this.expiringCustomers = expiringCustomers;
	}

	public CustomerStatsResponse getCustomerStats() {
		return customerStats;
	}

	public void setCustomerStats(CustomerStatsResponse customerStats) {
		this.customerStats = customerStats;
	}

	public List<CustomerExpiryReminderResponse> getExpiringCustomers() {
		return expiringCustomers;
	}

	public void setExpiringCustomers(List<CustomerExpiryReminderResponse> expiringCustomers) {
		this.expiringCustomers = expiringCustomers;
	}
}
