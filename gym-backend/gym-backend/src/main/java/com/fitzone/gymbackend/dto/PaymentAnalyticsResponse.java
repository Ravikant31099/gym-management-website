package com.fitzone.gymbackend.dto;

import java.util.List;

public class PaymentAnalyticsResponse {
	private PaymentSummaryResponse summary;

	private List<RevenueByPlanResponse> revenueByPlan;

	private List<PaymentModeResponse> paymentModes;

	private List<RevenueByMonthResponse> revenueByMonth;

	private List<RevenueByPlanResponse> topPlans;

	public PaymentAnalyticsResponse(PaymentSummaryResponse summary, List<RevenueByPlanResponse> revenueByPlan,
			List<PaymentModeResponse> paymentModes, List<RevenueByMonthResponse> revenueByMonth,
			List<RevenueByPlanResponse> topPlans) {
		super();
		this.summary = summary;
		this.revenueByPlan = revenueByPlan;
		this.paymentModes = paymentModes;
		this.revenueByMonth = revenueByMonth;
		this.topPlans = topPlans;
	}

	public PaymentAnalyticsResponse() {
		super();
	}

	public PaymentSummaryResponse getSummary() {
		return summary;
	}

	public void setSummary(PaymentSummaryResponse summary) {
		this.summary = summary;
	}

	public List<RevenueByPlanResponse> getRevenueByPlan() {
		return revenueByPlan;
	}

	public void setRevenueByPlan(List<RevenueByPlanResponse> revenueByPlan) {
		this.revenueByPlan = revenueByPlan;
	}

	public List<PaymentModeResponse> getPaymentModes() {
		return paymentModes;
	}

	public void setPaymentModes(List<PaymentModeResponse> paymentModes) {
		this.paymentModes = paymentModes;
	}

	public List<RevenueByMonthResponse> getRevenueByMonth() {
		return revenueByMonth;
	}

	public void setRevenueByMonth(List<RevenueByMonthResponse> revenueByMonth) {
		this.revenueByMonth = revenueByMonth;
	}

	public List<RevenueByPlanResponse> getTopPlans() {
		return topPlans;
	}

	public void setTopPlans(List<RevenueByPlanResponse> topPlans) {
		this.topPlans = topPlans;
	}

}
