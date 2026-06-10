package com.fitzone.gymbackend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "plan", indexes = { @Index(name = "idx_plan_active", columnList = "active") })
public class Plan extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long Id;
	private String name;
	private String description;
	private String price;
	private String period;
	private Boolean popular;
	@Column(nullable = false)
	private Boolean active = true;

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

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Plan(Long id, String name, String description, String price, String period, Boolean popular,
			Boolean active) {
		super();
		Id = id;
		this.name = name;
		this.description = description;
		this.price = price;
		this.period = period;
		this.popular = popular;
		this.active = active;
	}

	public Plan() {
	}

}
