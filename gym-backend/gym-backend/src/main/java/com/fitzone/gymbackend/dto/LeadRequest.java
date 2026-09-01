package com.fitzone.gymbackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class LeadRequest {

	@NotBlank(message = "Please enter name")
	@Size(max = 100, message = "Name cannot exceed 100 characters")
	private String name;

	@Email(message = "Invalid email")
	@NotBlank(message = "Please enter email")
	@Size(max = 100, message = "Email cannot exceed 100 characters")
	private String email;

	@NotBlank(message = "Please enter phone number")
	@Pattern(regexp = "^[0-9]{7,15}$", message = "Please enter a valid phone number")
	private String phone;

	@NotBlank(message = "Please enter subject")
	@Size(max = 150, message = "Subject cannot exceed 150 characters")
	private String subject;

	@NotBlank(message = "Please enter message")
	@Size(max = 2000, message = "Message cannot exceed 2000 characters")
	private String message;

	public LeadRequest() {
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

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}