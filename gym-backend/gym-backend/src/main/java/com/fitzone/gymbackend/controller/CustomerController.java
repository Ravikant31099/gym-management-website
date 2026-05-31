package com.fitzone.gymbackend.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
	public ResponseEntity<Map<String,String>> deleteCustomer(@PathVariable("id") Long id) {
		cs.deleteCustomer(id);
		Map<String, String> mp = new HashMap<>();
		mp.put("message", "Customer Deleted Successfully");
		return ResponseEntity.ok(mp);
	}
	
	@PutMapping("/{id}/renew")
	public ResponseEntity<CustomerResponse> renewMemberShip(@PathVariable("id") Long id, @RequestBody RenewalRequest r) {
		return ResponseEntity.ok(cs.renewMemberShip(id, r.getPlanId()));
	}
}