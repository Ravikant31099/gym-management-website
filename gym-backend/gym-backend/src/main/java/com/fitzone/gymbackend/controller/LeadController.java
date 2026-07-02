package com.fitzone.gymbackend.controller;

import com.fitzone.gymbackend.dto.LeadRequest;
import com.fitzone.gymbackend.dto.LeadResponse;
import com.fitzone.gymbackend.service.LeadService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/leads")
public class LeadController {

	private final LeadService leadService;

	public LeadController(LeadService leadService) {
		this.leadService = leadService;
	}

	@PostMapping
	public ResponseEntity<LeadResponse> saveLead(@Valid @RequestBody LeadRequest lead) {
		return ResponseEntity.status(HttpStatus.CREATED).body(leadService.saveLead(lead));
	}

	@GetMapping
	public ResponseEntity<List<LeadResponse>> getAllLeads() {
		return ResponseEntity.ok(leadService.getAllLeads());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteLead(@PathVariable("id") Long id) {
		leadService.deleteLead(id);
		return ResponseEntity.ok().build();
	}

	@PutMapping("/{id}/status")
	public ResponseEntity<LeadResponse> updateStatus(@PathVariable("id") Long id,
			@RequestParam("status") String status) {
		return ResponseEntity.ok(leadService.updateStatus(id, status));
	}

	@PutMapping("/{id}")
	public ResponseEntity<LeadResponse> updateLead(@PathVariable Long id, @Valid @RequestBody LeadRequest request) {
		return ResponseEntity.ok(leadService.updateLead(id, request));
	}

	@GetMapping("/export")
	public ResponseEntity<List<LeadResponse>> exportLeads(@RequestParam(required = false) String search,
			@RequestParam(required = false) String status) {
		return ResponseEntity.ok(leadService.exportLeads(search, status));
	}
}
