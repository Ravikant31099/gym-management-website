package com.fitzone.gymbackend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleGeneralException(Exception ex) {
		Map<String, Object> er = new HashMap<>();
		er.put("timestamp", LocalDateTime.now());
		er.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
		er.put("error", "Internal Server Error");
		er.put("message", ex.getMessage());
		return new ResponseEntity<>(er, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidException(MethodArgumentNotValidException ex) {
		Map<String, String> errors = new HashMap<>();
		ex.getBindingResult().getAllErrors().forEach(error -> {
			String fieldName = ((FieldError) error).getField();
			String errorMessage = error.getDefaultMessage();
			errors.put(fieldName, errorMessage);
		});
		return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(ResourceNotFound.class)
	public ResponseEntity<Map<String, String>> handleResourceNotFoundException(ResourceNotFound rnf) {
		Map<String, String> error = new HashMap<>();
		error.put("error", rnf.getMessage());
		return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
	}
}
