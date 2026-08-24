package com.fitzone.gymbackend.entity;

import java.time.LocalDateTime;

import com.fitzone.gymbackend.enums.UserRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User extends BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	@Column(unique = true)
	private String email;

	private String password;

	@Enumerated(EnumType.STRING)
	private UserRole role;

	private Boolean active = true;

	private Boolean deleted = false;

	@Column(name = "profile_image_url")
	private String profileImageUrl;

	private LocalDateTime imageUpdatedAt;

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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
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

	public Boolean getDeleted() {
		return deleted;
	}

	public void setDeleted(Boolean deleted) {
		this.deleted = deleted;
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
