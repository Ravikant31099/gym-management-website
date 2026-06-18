package com.fitzone.gymbackend.dto;

import java.time.LocalDate;

public class CustomerExpiryReminderResponse {

	private Long id;
	private String name;
	private String phone;
	private String planName;
	private LocalDate expiryDate;
	private Long daysRemaining;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getPlanName() {
		return planName;
	}

	public void setPlanName(String planName) {
		this.planName = planName;
	}

	public LocalDate getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(LocalDate expiryDate) {
		this.expiryDate = expiryDate;
	}

	public Long getDaysRemaining() {
		return daysRemaining;
	}

	public void setDaysRemaining(Long daysRemaining) {
		this.daysRemaining = daysRemaining;
	}
}
