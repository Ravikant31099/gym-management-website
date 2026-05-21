package com.fitzone.gymbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PlanRequest {

	@NotBlank(message = "Please Enter Plan Name")
	private String name;

	@NotBlank(message = "Please Enter Plan Description")
	private String description;

	@NotBlank(message = "Please Enter Plan Price")
	private String price;

	@NotBlank(message = "Please Enter Plan Period")
	private String period;

	@NotNull(message = "Popularity Not Provided")
	private Boolean popular;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	public String getPeriod() {
		return period;
	}

	public void setPeriod(String period) {
		this.period = period;
	}

	public Boolean getPopular() {
		return popular;
	}

	public void setPopular(Boolean popular) {
		this.popular = popular;
	}

	public PlanRequest() {
	}

}
