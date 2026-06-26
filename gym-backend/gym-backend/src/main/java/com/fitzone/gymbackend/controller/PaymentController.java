package com.fitzone.gymbackend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fitzone.gymbackend.dto.PaymentAnalyticsResponse;
import com.fitzone.gymbackend.dto.PaymentResponse;
import com.fitzone.gymbackend.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
	private final PaymentService paymentservice;

	public PaymentController(PaymentService paymentservice) {
		this.paymentservice = paymentservice;
	}

	@GetMapping
	public Page<PaymentResponse> getPayments(@RequestParam(name = "search", required = false) String search,
			@RequestParam(name = "status", required = false) String status,
			@RequestParam(name = "mode", required = false) String mode,
			@RequestParam(name = "planId", required = false) Long planId,
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size,
			@RequestParam(defaultValue = "paymentDate") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDir) {
		return paymentservice.getPayments(search, status, mode, planId, PageRequest.of(page, size), sortBy, sortDir);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletePayment(@PathVariable("id") Long id) {
		paymentservice.deletePayment(id);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/analytics")
	public ResponseEntity<PaymentAnalyticsResponse> getAnalytics() {
		return ResponseEntity.ok(paymentservice.getAnalytics());
	}

	@GetMapping("/export")
	public ResponseEntity<List<PaymentResponse>> exportPayments(@RequestParam(required = false) String search,
			@RequestParam(required = false) String status, @RequestParam(required = false) String mode,
			@RequestParam(required = false) Long planId) {
		return ResponseEntity.ok(paymentservice.exportPayments(search, status, mode, planId));
	}

}
