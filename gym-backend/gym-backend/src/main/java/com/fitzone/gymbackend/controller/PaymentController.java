package com.fitzone.gymbackend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
	public ResponseEntity<Map<String, String>> deletePayment(@PathVariable("id") Long id) {
		pS.deletePayment(id);
		Map<String, String> response = new HashMap<>();
		response.put("message", "Payment deleted successfully");
		return ResponseEntity.ok(response);
	}
}
