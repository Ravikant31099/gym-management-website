package com.fitzone.gymbackend.dto;

import java.math.BigDecimal;

public class PaymentSummaryResponse {
	private BigDecimal totalRevenue;
	private BigDecimal pendingRevenue;
	private BigDecimal todayCollection;
	private Long totalTransactions;

	public PaymentSummaryResponse(BigDecimal totalRevenue, BigDecimal pendingRevenue, BigDecimal todayCollection,
			Long totalTransactions) {
		super();
		this.totalRevenue = totalRevenue;
		this.pendingRevenue = pendingRevenue;
		this.todayCollection = todayCollection;
		this.totalTransactions = totalTransactions;
	}

	public PaymentSummaryResponse() {
		super();
	}

	public BigDecimal getTotalRevenue() {
		return totalRevenue;
	}

	public void setTotalRevenue(BigDecimal totalRevenue) {
		this.totalRevenue = totalRevenue;
	}

	public BigDecimal getPendingRevenue() {
		return pendingRevenue;
	}

	public void setPendingRevenue(BigDecimal pendingRevenue) {
		this.pendingRevenue = pendingRevenue;
	}

	public BigDecimal getTodayCollection() {
		return todayCollection;
	}

	public void setTodayCollection(BigDecimal todayCollection) {
		this.todayCollection = todayCollection;
	}

	public Long getTotalTransactions() {
		return totalTransactions;
	}

	public void setTotalTransactions(Long totalTransactions) {
		this.totalTransactions = totalTransactions;
	}

}
