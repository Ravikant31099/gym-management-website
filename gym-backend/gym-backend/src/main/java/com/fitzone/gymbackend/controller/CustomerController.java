package com.fitzone.gymbackend.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.fitzone.gymbackend.dto.CustomerRequest;
import com.fitzone.gymbackend.dto.CustomerResponse;
import com.fitzone.gymbackend.dto.RenewalRequest;
import com.fitzone.gymbackend.service.CustomerService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

	private final CustomerService customerService;

	public CustomerController(CustomerService customerService) {
		this.customerService = customerService;
	}

	@GetMapping
	public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
		return ResponseEntity.ok(customerService.getAllCustomer());
	}

	@PostMapping
	public ResponseEntity<CustomerResponse> createCustomer(@Valid @RequestBody CustomerRequest c) {
		return ResponseEntity.status(HttpStatus.CREATED).body(customerService.saveCustomer(c));
	}

	@PutMapping("/{id}")
	public ResponseEntity<CustomerResponse> updateCustomer(@PathVariable("id") Long id,
			@Valid @RequestBody CustomerRequest c) {
		return ResponseEntity.ok(customerService.updateCustomer(id, c));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteCustomer(@PathVariable("id") Long id) {
		try {
			customerService.deleteCustomer(id);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@PutMapping("/{id}/renew")
	public ResponseEntity<CustomerResponse> renewMembership(@PathVariable("id") Long id,
			@RequestBody RenewalRequest r) {
		return ResponseEntity.ok(customerService.renewMemberShip(id, r.getPlanId()));
	}
}