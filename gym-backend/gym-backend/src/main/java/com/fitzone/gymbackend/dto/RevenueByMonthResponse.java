package com.fitzone.gymbackend.dto;

public class RevenueByMonthResponse {
	private String monthYear;
	private Double revenue;

	public String getMonthYear() {
		return monthYear;
	}

	public void setMonthYear(String monthYear) {
		this.monthYear = monthYear;
	}

	public Double getRevenue() {
		return revenue;
	}

	public void setRevenue(Double revenue) {
		this.revenue = revenue;
	}

	public RevenueByMonthResponse(String monthYear, Double revenue) {
		super();
		this.monthYear = monthYear;
		this.revenue = revenue;
	}

	public RevenueByMonthResponse() {
		super();
	}

}
