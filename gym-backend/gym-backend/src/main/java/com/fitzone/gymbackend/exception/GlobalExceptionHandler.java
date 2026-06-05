package com.fitzone.gymbackend.exception;

import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

	public record ErrorDetails(long timestamp, int status, String error, String message, String path) {
	}

	@ExceptionHandler(ResourceNotFound.class)
	public ResponseEntity<ErrorDetails> handleResourceNotFoundException(ResourceNotFound ex,
			HttpServletRequest request) {
		return buildResponse(HttpStatus.NOT_FOUND, ex, request);
	}

	@ExceptionHandler(ResourceInUseException.class)
	public ResponseEntity<ErrorDetails> handleResourceInUseException(ResourceInUseException ex,
			HttpServletRequest request) {
		return buildResponse(HttpStatus.CONFLICT, ex, request);
	}

	@ExceptionHandler(BusinessException.class)
	public ResponseEntity<ErrorDetails> BusinessException(BusinessException ex, HttpServletRequest request) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex, request);
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorDetails> handleGeneralException(Exception ex, HttpServletRequest request) {
		return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, ex, request);
	}

	private ResponseEntity<ErrorDetails> buildResponse(HttpStatus status, Exception ex, HttpServletRequest request) {
		ErrorDetails error = new ErrorDetails(System.currentTimeMillis(), status.value(), status.getReasonPhrase(),
				ex.getMessage(), request.getRequestURI());
		return new ResponseEntity<>(error, status);
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ResponseEntity<ErrorDetails> handleNotReadable(HttpMessageNotReadableException ex,
			HttpServletRequest request) {
		return buildResponse(HttpStatus.BAD_REQUEST, ex, request);
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorDetails> handleValidation(MethodArgumentNotValidException ex,
			HttpServletRequest request) {
		String message = ex.getBindingResult().getFieldErrors().stream()
				.map(e -> e.getField() + ": " + e.getDefaultMessage()).collect(Collectors.joining(", "));
		ErrorDetails error = new ErrorDetails(System.currentTimeMillis(), HttpStatus.BAD_REQUEST.value(),
				HttpStatus.BAD_REQUEST.getReasonPhrase(), message, request.getRequestURI());
		return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	public ResponseEntity<ErrorDetails> handleMethodNotAllowed(HttpRequestMethodNotSupportedException ex,
			HttpServletRequest request) {
		return buildResponse(HttpStatus.METHOD_NOT_ALLOWED, ex, request);
	}
}
