package com.fitzone.gymbackend.exception;

@SuppressWarnings("serial")
public class ResourceInUseException extends RuntimeException {
	public ResourceInUseException(String message) {
		super(message);
	}
}
