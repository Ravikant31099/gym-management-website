package com.fitzone.gymbackend.dto;

public class PaymentModeResponse {
	private String name;
	private Long value;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Long getValue() {
		return value;
	}

	public void setValue(Long value) {
		this.value = value;
	}

	public PaymentModeResponse(String name, Long value) {
		super();
		this.name = name;
		this.value = value;
	}

	public PaymentModeResponse() {
		super();
	}

}
