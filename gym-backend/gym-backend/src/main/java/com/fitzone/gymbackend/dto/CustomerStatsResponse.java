package com.fitzone.gymbackend.dto;

public class CustomerStatsResponse {
	private long totalCustomers;
	private long activeCustomers;
	private long expiredCustomers;
	private long expiringCustomers;
	private long inactiveCustomers;

	public CustomerStatsResponse(long totalCustomers, long activeCustomers, long expiredCustomers,
			long expiringCustomers, long inactiveCustomers) {
		super();
		this.totalCustomers = totalCustomers;
		this.activeCustomers = activeCustomers;
		this.expiredCustomers = expiredCustomers;
		this.expiringCustomers = expiringCustomers;
		this.inactiveCustomers = inactiveCustomers;
	}

	public Long getExpiringCustomers() {
		return expiringCustomers;
	}

	public long getTotalCustomers() {
		return totalCustomers;
	}

	public long getActiveCustomers() {
		return activeCustomers;
	}

	public long getExpiredCustomers() {
		return expiredCustomers;
	}

	public long getInactiveCustomers() {
		return inactiveCustomers;
	}

}
