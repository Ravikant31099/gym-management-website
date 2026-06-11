package com.fitzone.gymbackend.dto;

public class CustomerGrowthResponse {
	private String month;
	private Long customers;

	public CustomerGrowthResponse(String month, Long customers) {
		this.month = month;
		this.customers = customers;
	}

	public String getMonth() {
		return month;
	}

	public Long getCustomers() {
		return customers;
	}
}
