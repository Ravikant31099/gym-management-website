package com.fitzone.gymbackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class LeadRequest {

	@NotBlank(message = "Please enter name")
	private String name;

	@Email(message = "Invalid email")
	@NotBlank(message = "Please enter email")
	private String email;

	@Pattern(regexp = "^[0-9]{7,15}$", message = "Please enter valid Phone Number")
	private String phone;

	@NotBlank(message = "Please enter subject")
	private String subject;

	@NotBlank(message = "Please enter message")
	private String message;

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

	public LeadRequest(@NotBlank(message = "Please enter name") String name,
			@Email(message = "Invalid email") @NotBlank(message = "Please enter email") String email,
			@Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits") String phone,
			@NotBlank(message = "Please enter subject") String subject,
			@NotBlank(message = "Please enter message") String message) {
		super();
		this.name = name;
		this.email = email;
		this.phone = phone;
		this.subject = subject;
		this.message = message;
	}

	public LeadRequest() {
		super();
	}

}
