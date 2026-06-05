package com.fitzone.gymbackend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.NotBlank;

public class PaymentRequest {
	@NotNull(message = "Customer is required")
	private Long customerId;

	@NotNull(message = "Plan is required")
	private Long planId;

	@NotBlank(message = "Payment mode is required")
	private String paymentMode;

	@NotBlank(message = "Payment status is required")
	private String status;

	@Size(max = 500, message = "Remarks cannot exceed 500 characters")
	private String remarks;

	public PaymentRequest() {
		super();
	}

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public Long getPlanId() {
		return planId;
	}

	public void setPlanId(Long planId) {
		this.planId = planId;
	}

	public String getPaymentMode() {
		return paymentMode;
	}

	public void setPaymentMode(String paymentMode) {
		this.paymentMode = paymentMode;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

}
