package com.fitzone.gymbackend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "customer")
public class Customer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private String email;
	private String phone;
	private LocalDate joinDate;
	private LocalDate expiryDate;
	private String status;
	@ManyToOne
	@JoinColumn(name = "plan_id")
	private Plan plan;
	@Column(nullable = false)
	private Boolean archived = false;

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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public LocalDate getJoinDate() {
		return joinDate;
	}

	public void setJoinDate(LocalDate joinDate) {
		this.joinDate = joinDate;
	}

	public LocalDate getExpiryDate() {
		return expiryDate;
	}

	public void setExpiryDate(LocalDate expiryDate) {
		this.expiryDate = expiryDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Plan getPlan() {
		return plan;
	}

	public void setPlan(Plan plan) {
		this.plan = plan;
	}

	public Boolean getArchived() {
		return archived;
	}

	public void setArchived(Boolean archived) {
		this.archived = archived;
	}

	public Customer() {
	}

	public Customer(Long id, String name, String email, String phone, LocalDate joinDate, LocalDate expiryDate,
			String status, Plan plan, boolean archived) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.phone = phone;
		this.joinDate = joinDate;
		this.expiryDate = expiryDate;
		this.status = status;
		this.plan = plan;
		this.archived = archived;
	}

}
