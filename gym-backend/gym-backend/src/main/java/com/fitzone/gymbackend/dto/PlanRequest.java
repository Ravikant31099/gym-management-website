package com.fitzone.gymbackend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class PlanRequest {

	@NotBlank(message = "Plan name is required")
	@Size(min = 2, max = 50, message = "Plan name must be between 2 and 50 characters")
	private String name;

	@NotBlank(message = "Plan description is required")
	@Size(max = 500, message = "Description cannot exceed 500 characters")
	private String description;

	@NotBlank(message = "Plan price is required")
	@Pattern(regexp = "^[0-9]+(\\.[0-9]{1,2})?$", message = "Invalid price format")
	private BigDecimal price;

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

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
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
