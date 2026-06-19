package com.fitzone.gymbackend.dto;

public class CustomerExportResponse {
	private Long id;
	private String name;
	private String email;
	private String phone;
	private String planName;
	private String status;
	private String joinDate;
	private String expiryDate;
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

	public String getPlanName() {
		return planName;
	}

	public void setPlanName(String planName) {
		this.planName = planName;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getJoinDate() {
		return joinDate;
	}

	public void setJoinDate(String joinDate) {
		this.joinDate = joinDate;
	}

	public String getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(String expiryDate) {
		this.expiryDate = expiryDate;
	}

	public Long getDaysRemaining() {
		return daysRemaining;
	}

	public void setDaysRemaining(Long daysRemaining) {
		this.daysRemaining = daysRemaining;
	}
}
