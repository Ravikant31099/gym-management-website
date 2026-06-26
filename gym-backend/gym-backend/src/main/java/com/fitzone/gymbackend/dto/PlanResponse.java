package com.fitzone.gymbackend.dto;

import java.math.BigDecimal;

public class PlanResponse {
	
	private Long Id;
	private String name;
	private String description;
	private BigDecimal price;
	private String period;
	private Boolean popular;
	
	public PlanResponse(Long id, String name, String description, BigDecimal price, String period, Boolean popular) {
		super();
		Id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.period = period;
		this.popular = popular;
	}

	public Long getId() {
		return Id;
	}

	public void setId(Long id) {
		Id = id;
	}

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

	
	
}
