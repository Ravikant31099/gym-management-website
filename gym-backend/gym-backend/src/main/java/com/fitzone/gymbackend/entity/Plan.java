package com.fitzone.gymbackend.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;

@Entity
@Table(name = "plan", indexes = { @Index(name = "idx_plan_active", columnList = "active") }, uniqueConstraints = {
		@UniqueConstraint(name = "uk_plan_name", columnNames = "name") })
public class Plan extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	private String description;

	@Column(nullable = false)
	private BigDecimal price;

	@Column(nullable = false)
	private Integer period;

	private Boolean popular;

	@Column(nullable = false)
	private Boolean active = true;

	public Plan() {
	}

	public Plan(Long id, String name, String description, BigDecimal price, Integer period, Boolean popular,
			Boolean active) {
		super();
		this.id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.period = period;
		this.popular = popular;
		this.active = active;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public Integer getPeriod() {
		return period;
	}

	public void setPeriod(Integer period) {
		this.period = period;
	}

	public Boolean getPopular() {
		return popular;
	}

	public void setPopular(Boolean popular) {
		this.popular = popular;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}
}