package com.fitzone.gymbackend.entity;

import java.time.LocalDateTime;

import com.fitzone.gymbackend.enums.ActivityType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "audit_log")
public class AuditLog {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String module;
	private Long entityId;
	private ActivityType activityType;
	@Column(length = 1000)
	private String description;
	private String performedBy;
	private LocalDateTime createdAt;

	@PrePersist
	public void prePersist() {
		createdAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public String getModule() {
		return module;
	}

	public Long getEntityId() {
		return entityId;
	}

	public ActivityType getActivityType() {
		return activityType;
	}

	public String getDescription() {
		return description;
	}

	public String getPerformedBy() {
		return performedBy;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public void setModule(String module) {
		this.module = module;
	}

	public void setEntityId(Long entityId) {
		this.entityId = entityId;
	}

	public void setActivityType(ActivityType activityType) {
		this.activityType = activityType;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public void setPerformedBy(String performedBy) {
		this.performedBy = performedBy;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

}
