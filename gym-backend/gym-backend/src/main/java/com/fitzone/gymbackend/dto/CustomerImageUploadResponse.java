package com.fitzone.gymbackend.dto;

import java.time.LocalDateTime;

public class CustomerImageUploadResponse {
	private Long customerId;
	private String customerName;
	private String imageUrl;
	private String message;
	private String uploadedBy;
	private LocalDateTime uploadedAt;

	public CustomerImageUploadResponse(Long customerId, String customerName, String imageUrl, LocalDateTime uploadedAt,
			String uploadedBy, String message) {
		this.customerId = customerId;
		this.customerName = customerName;
		this.imageUrl = imageUrl;
		this.uploadedAt = uploadedAt;
		this.uploadedBy = uploadedBy;
		this.message = message;
	}

	public Long getCustomerId() {
		return customerId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public String getMessage() {
		return message;
	}

	public String getUploadedBy() {
		return uploadedBy;
	}

	public LocalDateTime getUploadedAt() {
		return uploadedAt;
	}
}
