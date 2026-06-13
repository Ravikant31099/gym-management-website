package com.fitzone.gymbackend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "customer", indexes = { @Index(name = "idx_customer_phone", columnList = "phone"),
		@Index(name = "idx_customer_email", columnList = "email"),
		@Index(name = "idx_customer_status", columnList = "status"),
		@Index(name = "idx_customer_archived", columnList = "archived") })
public class Customer extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	@Column(nullable = false, unique = true)
	private String phone;
	@Column(nullable = false, unique = true)
	private String email;
	private LocalDate joinDate;
	private LocalDate expiryDate;
	private String status;
	@ManyToOne
	@JoinColumn(name = "plan_id")
	private Plan plan;
	@Column(nullable = false)
	private Boolean archived = false;
	@Column(name = "profile_image_url")
	private String profileImageUrl;
	private LocalDateTime imageUpdatedAt;

	public String getImageUpdatedBy() {
		return imageUpdatedBy;
	}

	public void setImageUpdatedBy(String imageUpdatedBy) {
		this.imageUpdatedBy = imageUpdatedBy;
	}

	private String imageUpdatedBy;

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

	public String getProfileImageUrl() {
		return profileImageUrl;
	}

	public void setProfileImageUrl(String profileImageUrl) {
		this.profileImageUrl = profileImageUrl;
	}
	
	public LocalDateTime getImageUpdatedAt() {
		return imageUpdatedAt;
	}

	public void setImageUpdatedAt(LocalDateTime imageUpdatedAt) {
		this.imageUpdatedAt = imageUpdatedAt;
	}

	public Customer() {
	}

	public Customer(Long id, String profileImageUrl, String name, String email, String phone, LocalDate joinDate,
			LocalDate expiryDate, String status, Plan plan, boolean archived) {
		super();
		this.id = id;
		this.profileImageUrl = profileImageUrl;
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
