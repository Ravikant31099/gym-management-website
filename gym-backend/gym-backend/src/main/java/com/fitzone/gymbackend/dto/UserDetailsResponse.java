package com.fitzone.gymbackend.dto;

import java.time.LocalDateTime;
import com.fitzone.gymbackend.enums.UserRole;

public class UserDetailsResponse {
	private Long id;
	private String name;
	private String email;
	private UserRole role;
	private Boolean active;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private String profileImageUrl;
	private LocalDateTime imageUpdatedAt;
	private String imageUpdatedBy;

	public UserDetailsResponse(Long id, String name, String email, UserRole role, Boolean active,
			LocalDateTime createdAt, LocalDateTime updatedAt, String profileImageUrl, LocalDateTime imageUpdatedAt,
			String imageUpdatedBy) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.role = role;
		this.active = active;
		this.createdAt = createdAt;
		this.updatedAt = updatedAt;
		this.profileImageUrl = profileImageUrl;
		this.imageUpdatedAt = imageUpdatedAt;
		this.imageUpdatedBy = imageUpdatedBy;

	}

	public UserDetailsResponse() {
		super();
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public UserRole getRole() {
		return role;
	}

	public void setRole(UserRole role) {
		this.role = role;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
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

	public String getImageUpdatedBy() {
		return imageUpdatedBy;
	}

	public void setImageUpdatedBy(String imageUpdatedBy) {
		this.imageUpdatedBy = imageUpdatedBy;
	}

}