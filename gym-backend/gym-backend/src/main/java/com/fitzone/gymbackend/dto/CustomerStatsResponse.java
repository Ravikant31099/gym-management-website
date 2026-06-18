package com.fitzone.gymbackend.dto;

import java.math.BigDecimal;

public class CustomerStatsResponse {
	private Long totalCustomers;
	private Long activeCustomers;
	private Long inactiveCustomers;
	private Long expiringToday;
	private Long expiringCustomers;
	private Long expiredCustomers;
	private Long newCustomersThisMonth;
	private Long renewalsThisMonth;
	private BigDecimal revenueThisMonth;

	public CustomerStatsResponse() {
	}

	public Long getTotalCustomers() {
		return totalCustomers;
	}

	public void setTotalCustomers(Long totalCustomers) {
		this.totalCustomers = totalCustomers;
	}

	public Long getActiveCustomers() {
		return activeCustomers;
	}

	public void setActiveCustomers(Long activeCustomers) {
		this.activeCustomers = activeCustomers;
	}

	public Long getInactiveCustomers() {
		return inactiveCustomers;
	}

	public void setInactiveCustomers(Long inactiveCustomers) {
		this.inactiveCustomers = inactiveCustomers;
	}

	public Long getExpiringToday() {
		return expiringToday;
	}

	public void setExpiringToday(Long expiringToday) {
		this.expiringToday = expiringToday;
	}

	public Long getExpiringCustomers() {
		return expiringCustomers;
	}

	public void setExpiringCustomers(Long expiringCustomers) {
		this.expiringCustomers = expiringCustomers;
	}

	public Long getExpiredCustomers() {
		return expiredCustomers;
	}

	public void setExpiredCustomers(Long expiredCustomers) {
		this.expiredCustomers = expiredCustomers;
	}

	public Long getNewCustomersThisMonth() {
		return newCustomersThisMonth;
	}

	public void setNewCustomersThisMonth(Long newCustomersThisMonth) {
		this.newCustomersThisMonth = newCustomersThisMonth;
	}

	public Long getRenewalsThisMonth() {
		return renewalsThisMonth;
	}

	public void setRenewalsThisMonth(Long renewalsThisMonth) {
		this.renewalsThisMonth = renewalsThisMonth;
	}

	public BigDecimal getRevenueThisMonth() {
		return revenueThisMonth;
	}

	public void setRevenueThisMonth(BigDecimal revenueThisMonth) {
		this.revenueThisMonth = revenueThisMonth;
	}

}
