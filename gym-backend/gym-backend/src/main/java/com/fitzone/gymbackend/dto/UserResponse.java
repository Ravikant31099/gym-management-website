package com.fitzone.gymbackend.dto;

import com.fitzone.gymbackend.enums.UserRole;

public class UserResponse {
	private Long id;
	private String name;
	private String email;
	private UserRole role;
	private Boolean active;

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

	public UserResponse() {
		super();
	}

	public UserResponse(Long id, String name, String email, UserRole role, Boolean active) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.role = role;
		this.active = active;
	}

}
