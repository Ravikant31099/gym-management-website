package com.fitzone.gymbackend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name = "leads")
public class Lead {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long Id;
	@NotBlank(message = "Please Enter Name")
	private String name;
	@Email(message = "Invalid E-mail")
	@NotBlank(message = "Please Enter E-mail")
	private String email;
	@NotBlank(message = "Please Enter Phone Number")
	@Pattern(regexp = "[0-9]{10}$", message = "Phone Number must be 10 Digit")
	private String phone;
	@NotBlank(message = "Please Enter Subject")
	private String subject;
	@NotBlank(message = "Pleas Enter Message")
	private String message;
	private String status = "NEW";

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

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
