package com.fitzone.gymbackend.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.fitzone.gymbackend.dto.LeadAnalyticsResponse;
import com.fitzone.gymbackend.dto.LeadRequest;
import com.fitzone.gymbackend.dto.LeadResponse;
import com.fitzone.gymbackend.service.LeadService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/leads")
@Validated
public class LeadController {

	private final LeadService leadService;

	public LeadController(LeadService leadService) {
		this.leadService = leadService;
	}

	@PostMapping
	public ResponseEntity<LeadResponse> saveLead(@Valid @RequestBody LeadRequest lead, HttpServletRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(leadService.saveLead(lead, resolveClientIp(request)));
	}

	@GetMapping
	public ResponseEntity<Page<LeadResponse>> getAllLeads(@RequestParam(defaultValue = "") String search,
			@RequestParam(defaultValue = "") String status, @PageableDefault(size = 10) Pageable pageable,
			@RequestParam(defaultValue = "createdAt") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDir) {
		return ResponseEntity.ok(leadService.getAllLeads(search, status, pageable, sortBy, sortDir));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteLead(@PathVariable("id") @Positive Long id) {
		leadService.deleteLead(id);
		return ResponseEntity.ok().build();
	}

	@PutMapping("/{id}/status")
	public ResponseEntity<LeadResponse> updateStatus(@PathVariable("id") @Positive Long id,
			@RequestParam("status") String status) {
		return ResponseEntity.ok(leadService.updateStatus(id, status));
	}

	@PutMapping("/{id}")
	public ResponseEntity<LeadResponse> updateLead(@PathVariable("id") @Positive Long id,
			@Valid @RequestBody LeadRequest request) {
		return ResponseEntity.ok(leadService.updateLead(id, request));
	}

	@GetMapping("/export")
	public ResponseEntity<List<LeadResponse>> exportLeads(@RequestParam(required = false) String search,
			@RequestParam(required = false) String status) {
		return ResponseEntity.ok(leadService.exportLeads(search, status));
	}

	@GetMapping("/analytics")
	public ResponseEntity<LeadAnalyticsResponse> getLeadAnalytics() {
		return ResponseEntity.ok(leadService.getLeadAnalytics());
	}

	private String resolveClientIp(HttpServletRequest request) {
		String forwardedFor = request.getHeader("X-Forwarded-For");
		if (forwardedFor != null && !forwardedFor.isBlank()) {
			return forwardedFor.split(",")[0].trim();
		}
		return request.getRemoteAddr();
	}
}