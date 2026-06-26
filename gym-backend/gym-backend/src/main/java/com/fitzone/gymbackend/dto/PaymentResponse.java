package com.fitzone.gymbackend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PaymentResponse {

	private Long id;
	private String customerName;
	private Long customerId;
	private String planName;
	private Long planId;
	private BigDecimal amount;
	private LocalDate paymentDate;
	private String paymentMode;
	private String status;
	private String remarks;

	public PaymentResponse() {
		super();
	}

	public PaymentResponse(Long id, String customerName, Long customerId, String planName, Long planId,
			BigDecimal amount, LocalDate paymentDate, String paymentMode, String status, String remarks) {
		super();
		this.id = id;
		this.customerName = customerName;
		this.customerId = customerId;
		this.planName = planName;
		this.planId = planId;
		this.amount = amount;
		this.paymentDate = paymentDate;
		this.paymentMode = paymentMode;
		this.status = status;
		this.remarks = remarks;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
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

	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public LocalDate getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(LocalDate paymentDate) {
		this.paymentDate = paymentDate;
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
