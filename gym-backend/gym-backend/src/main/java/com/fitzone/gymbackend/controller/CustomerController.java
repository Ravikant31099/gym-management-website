package com.fitzone.gymbackend.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fitzone.gymbackend.dto.CustomerActivityResponse;
import com.fitzone.gymbackend.dto.CustomerAnalyticsResponse;
import com.fitzone.gymbackend.dto.CustomerDetailsResponse;
import com.fitzone.gymbackend.dto.CustomerExpiryReminderResponse;
import com.fitzone.gymbackend.dto.CustomerExportResponse;
import com.fitzone.gymbackend.dto.CustomerImageUploadResponse;
import com.fitzone.gymbackend.dto.CustomerRequest;
import com.fitzone.gymbackend.dto.CustomerResponse;
import com.fitzone.gymbackend.dto.CustomerStatsResponse;
import com.fitzone.gymbackend.dto.CustomerUpdateRequest;
import com.fitzone.gymbackend.dto.RenewalRequest;
import com.fitzone.gymbackend.service.CustomerActivityLogService;
import com.fitzone.gymbackend.service.CustomerService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/customers")
@Validated
public class CustomerController {

	private static final int MAX_PAGE_SIZE = 100;

	private final CustomerService customerService;
	private final CustomerActivityLogService customerActivityLogService;

	public CustomerController(CustomerService customerService, CustomerActivityLogService customerActivityLogService) {
		this.customerService = customerService;
		this.customerActivityLogService = customerActivityLogService;
	}

	@GetMapping
	public ResponseEntity<Page<CustomerResponse>> getAllCustomers(
			@RequestParam(name = "page", defaultValue = "0") @Min(0) int page,
			@RequestParam(name = "size", defaultValue = "10") @Min(1) @Max(MAX_PAGE_SIZE) int size,
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
	public ResponseEntity<CustomerDetailsResponse> getCustomerDetails(@PathVariable("id") @Positive Long id) {
		return ResponseEntity.ok(customerService.getCustomerDetails(id));
	}

	@PostMapping
	public ResponseEntity<CustomerResponse> createCustomer(@Valid @RequestBody CustomerRequest c) {
		return ResponseEntity.status(HttpStatus.CREATED).body(customerService.saveCustomer(c));
	}

	@PutMapping("/{id}")
	public ResponseEntity<CustomerResponse> updateCustomer(@PathVariable("id") @Positive Long id,
			@Valid @RequestBody CustomerUpdateRequest request) {
		return ResponseEntity.ok(customerService.updateCustomer(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteCustomer(@PathVariable("id") @Positive Long id) {
		customerService.archivedCustomer(id);
		return ResponseEntity.ok().build();
	}

	@PostMapping("/{id}/renew")
	public ResponseEntity<CustomerResponse> renewMembership(@PathVariable("id") @Positive Long id,
			@Valid @RequestBody RenewalRequest request) {
		return ResponseEntity.ok(customerService.renewMemberShip(id, request));
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
	public ResponseEntity<CustomerImageUploadResponse> uploadCustomerImage(@PathVariable("id") @Positive Long id,
			@RequestParam("file") MultipartFile file) throws IOException {
		return ResponseEntity.ok(customerService.uploadCustomerImage(id, file));
	}

	@GetMapping("/{id}/activities")
	public ResponseEntity<List<CustomerActivityResponse>> getCustomerActivities(
			@PathVariable("id") @Positive Long id) {
		return ResponseEntity.ok(customerActivityLogService.getCustomerActivities(id));
	}

	@GetMapping("/expiring-soon")
	public ResponseEntity<List<CustomerExpiryReminderResponse>> getExpiringSoonCustomers() {
		return ResponseEntity.ok(customerService.getExpiringSoonCustomers());
	}

	@GetMapping("/export")
	public ResponseEntity<List<CustomerExportResponse>> exportCustomers(
			@RequestParam(name = "search", required = false) String search,
			@RequestParam(name = "status", required = false) String status,
			@RequestParam(name = "planId", required = false) Long planId) {
		return ResponseEntity.ok(customerService.exportCustomers(search, status, planId));
	}
}