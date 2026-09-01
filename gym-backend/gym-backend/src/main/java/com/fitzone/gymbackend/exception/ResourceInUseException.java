package com.fitzone.gymbackend.exception;

public class ResourceInUseException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public ResourceInUseException(String message) {
		super(message);
	}
}