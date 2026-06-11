package com.fitzone.gymbackend.dto;

import java.util.List;

public class CustomerAnalyticsResponse {
	private CustomerStatsResponse stats;
	private String mostPopularPlan;

	private List<PlanDistributionResponse> planDistribution;

	private List<CustomerGrowthResponse> customerGrowth;

	private List<RecentCustomerResponse> recentCustomers;

	public CustomerAnalyticsResponse(CustomerStatsResponse stats, String mostPopularPlan,
			List<PlanDistributionResponse> planDistribution, List<CustomerGrowthResponse> customerGrowth,
			List<RecentCustomerResponse> recentCustomers) {

		this.stats = stats;
		this.mostPopularPlan = mostPopularPlan;
		this.planDistribution = planDistribution;
		this.customerGrowth = customerGrowth;
		this.recentCustomers = recentCustomers;
	}

	public CustomerStatsResponse getStats() {
		return stats;
	}

	public String getMostPopularPlan() {
		return mostPopularPlan;
	}

	public List<PlanDistributionResponse> getPlanDistribution() {
		return planDistribution;
	}

	public List<CustomerGrowthResponse> getCustomerGrowth() {
		return customerGrowth;
	}

	public List<RecentCustomerResponse> getRecentCustomers() {
		return recentCustomers;
	}
}
