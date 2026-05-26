package com.fitzone.gymbackend.dto;

import java.time.LocalDate;

public class CustomerResponse {
	private Long id;
	private String name;
	private String email;
	private String phone;
	private LocalDate joinDate;
	private LocalDate expiryDate;
	private String status;
	private Long planId;
	private String planName;
	private String planPrice;

	public CustomerResponse(Long id, String name, String email, String phone, LocalDate joinDate, LocalDate expiryDate,
			String status, Long planId, String planName, String planPrice) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.phone = phone;
		this.joinDate = joinDate;
		this.expiryDate = expiryDate;
		this.status = status;
		this.planId = planId;
		this.planName = planName;
		this.planPrice = planPrice;
	}

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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public LocalDate getJoinDate() {
		return joinDate;
	}

	public void setJoinDate(LocalDate joinDate) {
		this.joinDate = joinDate;
	}

	public LocalDate getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(LocalDate expiryDate) {
		this.expiryDate = expiryDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Long getPlanId() {
		return planId;
	}

	public void setPlanId(Long planId) {
		this.planId = planId;
	}

	public String getPlanName() {
		return planName;
	}

	public void setPlanName(String planName) {
		this.planName = planName;
	}

	public String getPlanPrice() {
		return planPrice;
	}

	public void setPlanPrice(String planPrice) {
		this.planPrice = planPrice;
	}

}
