package com.fitzone.gymbackend.controller;

import com.fitzone.gymbackend.entity.Lead;
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
	public ResponseEntity<Lead> saveLead(@Valid @RequestBody Lead lead) {
		return ResponseEntity.status(HttpStatus.CREATED).body(leadService.saveLead(lead));
	}

	@GetMapping
	public ResponseEntity<List<Lead>> getAllLeads() {
		return ResponseEntity.ok(leadService.getAllLeads());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteLead(@PathVariable("id") Long id) {
		leadService.deleteLead(id);
		return ResponseEntity.ok().build();
	}

	@PutMapping("/{id}/status")
	public ResponseEntity<Lead> updateStatus(@PathVariable("id") Long id, @RequestParam("status") String status) {
		return ResponseEntity.ok(leadService.updateStatus(id, status));
	}
}
