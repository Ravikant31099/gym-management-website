package com.fitzone.gymbackend.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fitzone.gymbackend.dto.CustomerAnalyticsResponse;
import com.fitzone.gymbackend.dto.CustomerDetailsResponse;
import com.fitzone.gymbackend.dto.CustomerImageUploadResponse;
import com.fitzone.gymbackend.dto.CustomerRequest;
import com.fitzone.gymbackend.dto.CustomerResponse;
import com.fitzone.gymbackend.dto.CustomerStatsResponse;
import com.fitzone.gymbackend.dto.RenewalRequest;
import com.fitzone.gymbackend.service.CustomerActivityLogService;
import com.fitzone.gymbackend.service.CustomerService;
import com.fitzone.gymbackend.dto.CustomerActivityResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

	private final CustomerService customerService;
	private final CustomerActivityLogService customerActivityLogService;

	public CustomerController(CustomerService customerService, CustomerActivityLogService customerActivityLogService) {
		this.customerService = customerService;
		this.customerActivityLogService = customerActivityLogService;
	}

	@GetMapping
	public ResponseEntity<Page<CustomerResponse>> getAllCustomers(
			@RequestParam(name = "page", defaultValue = "0") int page,
			@RequestParam(name = "size", defaultValue = "10") int size,
			@RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
			@RequestParam(name = "sortDir", defaultValue = "desc") String sortDir,
			@RequestParam(name = "search", required = false) String search,
			@RequestParam(name = "status", required = false) String status,
			@RequestParam(name = "membershipStatus", required = false) String membershipStatus,
			@RequestParam(name = "planId", required = false) Long planId) {
		return ResponseEntity.ok(
				customerService.getAllCustomer(page, size, sortBy, sortDir, search, status, membershipStatus, planId));
	}

	@GetMapping("/{id}")
	public ResponseEntity<CustomerDetailsResponse> getCustomerDetails(@PathVariable("id") Long id) {
		return ResponseEntity.ok(customerService.getCustomerDetails(id));
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
	public ResponseEntity<Void> deleteCustomer(@PathVariable("id") Long id) {
		customerService.archivedCustomer(id);
		return ResponseEntity.ok().build();
	}

	@PutMapping("/{id}/renew")
	public ResponseEntity<CustomerResponse> renewMembership(@PathVariable("id") Long id,
			@RequestBody RenewalRequest r) {
		return ResponseEntity.ok(customerService.renewMemberShip(id, r.getPlanId()));
	}

	@GetMapping("/stats")
	public ResponseEntity<CustomerStatsResponse> getCustomerStats() {
		return ResponseEntity.ok(customerService.getCustomerStats());
	}

	@GetMapping("/analytics")
	public ResponseEntity<CustomerAnalyticsResponse> getAnalytics() {
		return ResponseEntity.ok(customerService.getCustomerAnalytics());
	}

	@PostMapping("/{id}/upload-image")
	public ResponseEntity<CustomerImageUploadResponse> uploadCustomerImage(@PathVariable("id") Long id,
			@RequestParam("file") MultipartFile file) throws IOException {
		return ResponseEntity.ok(customerService.uploadCustomerImage(id, file));
	}

	@GetMapping("/{id}/activities")
	public ResponseEntity<List<CustomerActivityResponse>> getCustomerActivities(@PathVariable("id") Long id) {
		return ResponseEntity.ok(customerActivityLogService.getCustomerActivities(id));
	}
}