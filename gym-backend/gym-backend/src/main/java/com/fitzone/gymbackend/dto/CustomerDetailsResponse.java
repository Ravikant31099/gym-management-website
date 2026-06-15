package com.fitzone.gymbackend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CustomerDetailsResponse {
	private Long id;
	private String name;
	private String phone;
	private String email;
	private String status;
	private String planName;
	private Long planId;
	private LocalDate joinDate;
	private LocalDate expiryDate;
	private String profileImageUrl;
	private LocalDateTime imageUpdatedAt;
	private String imageUpdatedBy;
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getPlanName() {
		return planName;
	}

	public void setPlanName(String planName) {
		this.planName = planName;
	}
	
	public Long getPlanId() {
		return planId;
	}

	public void setPlanId(Long planId) {
		this.planId = planId;
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

	public String getProfileImageUrl() {
		return profileImageUrl;
	}

	public void setProfileImageUrl(String profileImageUrl) {
		this.profileImageUrl = profileImageUrl;
	}

	public LocalDateTime getImageUpdatedAt() {
		return imageUpdatedAt;
	}

	public void setImageUpdatedAt(LocalDateTime imageUpdatedAt) {
		this.imageUpdatedAt = imageUpdatedAt;
	}

	public String getImageUpdatedBy() {
		return imageUpdatedBy;
	}

	public void setImageUpdatedBy(String imageUpdatedBy) {
		this.imageUpdatedBy = imageUpdatedBy;
	}

	public Long getDaysRemaining() {
		return daysRemaining;
	}

	public void setDaysRemaining(Long daysRemaining) {
		this.daysRemaining = daysRemaining;
	}
}
