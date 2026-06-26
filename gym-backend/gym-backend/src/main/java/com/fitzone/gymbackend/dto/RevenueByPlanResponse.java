package com.fitzone.gymbackend.dto;

import java.math.BigDecimal;

public class RevenueByPlanResponse {

	private String plan;
	private BigDecimal revenue;

	public RevenueByPlanResponse(String plan, BigDecimal revenue) {
		this.plan = plan;
		this.revenue = revenue;
	}

	public String getPlan() {
		return plan;
	}

	public void setPlan(String plan) {
		this.plan = plan;
	}

	public BigDecimal getRevenue() {
		return revenue;
	}

	public void setRevenue(BigDecimal revenue) {
		this.revenue = revenue;
	}

}
