package com.fitzone.gymbackend.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fitzone.gymbackend.dto.PaymentRequest;
import com.fitzone.gymbackend.dto.PaymentResponse;
import com.fitzone.gymbackend.service.PaymentService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {
	private final PaymentService pS;

	public PaymentController(PaymentService pS) {
		this.pS = pS;
	}

	@GetMapping
	public ResponseEntity<List<PaymentResponse>> getAllPayments() {
		return ResponseEntity.ok(pS.getAllPayments());
	}

	@PostMapping
	public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody PaymentRequest req) {
		return ResponseEntity.ok(pS.savePayment(req));
	}

	@PutMapping("/{id}")
	public ResponseEntity<PaymentResponse> updatePayment(@PathVariable("id") Long id,
			@Valid @RequestBody PaymentRequest req) {
		return ResponseEntity.ok(pS.updatePayment(id, req));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deletePayment(@PathVariable("id") Long id) {
		try {
			pS.deletePayment(id);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}
