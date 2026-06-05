package com.fitzone.gymbackend.controller;

import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fitzone.gymbackend.dto.CustomerRequest;
import com.fitzone.gymbackend.dto.CustomerResponse;
import com.fitzone.gymbackend.service.CustomerService;
import com.fitzone.gymbackend.dto.RenewalRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

	private final CustomerService cs;

	public CustomerController(CustomerService cs) {
		this.cs = cs;
	}

	@GetMapping
	public ResponseEntity<List<CustomerResponse>> getAllCustomer() {
		return ResponseEntity.ok(cs.getAllCustomer());
	}

	@PostMapping
	public ResponseEntity<CustomerResponse> createCustomer(@Valid @RequestBody CustomerRequest c) {
		return ResponseEntity.ok(cs.saveCustomer(c));
	}

	@PutMapping("/{id}")
	public ResponseEntity<CustomerResponse> updateCustomer(@PathVariable("id") Long id,
			@Valid @RequestBody CustomerRequest c) {
		return ResponseEntity.ok(cs.updateCustomer(id, c));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteCustomer(@PathVariable("id") Long id) {
		try {
			cs.deleteCustomer(id);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PutMapping("/{id}/renew")
	public ResponseEntity<CustomerResponse> renewMemberShip(@PathVariable("id") Long id,
			@RequestBody RenewalRequest r) {
		return ResponseEntity.ok(cs.renewMemberShip(id, r.getPlanId()));
	}
}