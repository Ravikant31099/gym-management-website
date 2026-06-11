package com.fitzone.gymbackend.dto;

public class PlanDistributionResponse {
	private String planName;
	private Long count;

	public PlanDistributionResponse(String planName, Long count) {
		this.planName = planName;
		this.count = count;
	}

	public String getPlanName() {
		return planName;
	}

	public Long getCount() {
		return count;
	}
}
