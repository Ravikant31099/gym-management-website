package com.fitzone.gymbackend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.fitzone.gymbackend.dto.PaymentAnalyticsResponse;
import com.fitzone.gymbackend.dto.PaymentRequest;
import com.fitzone.gymbackend.dto.PaymentResponse;
import com.fitzone.gymbackend.service.PaymentService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/payments")
@Validated
public class PaymentController {

	private static final int MAX_PAGE_SIZE = 100;

	private final PaymentService paymentService;

	public PaymentController(PaymentService paymentService) {
		this.paymentService = paymentService;
	}

	@GetMapping
	public Page<PaymentResponse> getPayments(@RequestParam(name = "search", required = false) String search,
			@RequestParam(name = "status", required = false) String status,
			@RequestParam(name = "mode", required = false) String mode,
			@RequestParam(name = "planId", required = false) Long planId,
			@RequestParam(name = "page", defaultValue = "0") @Min(0) int page,
			@RequestParam(name = "size", defaultValue = "10") @Min(1) @Max(MAX_PAGE_SIZE) int size,
			@RequestParam(defaultValue = "paymentDate") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDir) {
		return paymentService.getPayments(search, status, mode, planId, PageRequest.of(page, size), sortBy, sortDir);
	}

	@PostMapping
	public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest request) {
		return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
				.body(paymentService.savePayment(request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletePayment(@PathVariable("id") @Positive Long id) {
		paymentService.deletePayment(id);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/analytics")
	public ResponseEntity<PaymentAnalyticsResponse> getAnalytics() {
		return ResponseEntity.ok(paymentService.getAnalytics());
	}

	@GetMapping("/export")
	public ResponseEntity<List<PaymentResponse>> exportPayments(@RequestParam(required = false) String search,
			@RequestParam(required = false) String status, @RequestParam(required = false) String mode,
			@RequestParam(required = false) Long planId) {
		return ResponseEntity.ok(paymentService.exportPayments(search, status, mode, planId));
	}
}