package com.fitzone.gymbackend.controller;

import com.fitzone.gymbackend.entity.Lead;
import com.fitzone.gymbackend.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import java.util.*;
import com.fitzone.gymbackend.exception.ResourceNotFound;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin("*")
public class LeadController {

	@Autowired
	private LeadRepository lr;

	@PostMapping
	public Lead saveLead(@Valid @RequestBody Lead l) {
		return lr.save(l);
	}

	@GetMapping
	public List<Lead> getAllLead() {
		return lr.findAll();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Map<String, String>> deleteLead(@PathVariable("id") Long id) {
		Lead l = lr.findById(id).orElseThrow(() -> new ResourceNotFound("Lead Not Found with Id: " + id));
		lr.delete(l);
		Map<String, String> mp = new HashMap<>();
		mp.put("message", "Lead Deleted Successfully");
		return ResponseEntity.ok(mp);
	}

	@PutMapping("/{id}/status")
	public Lead updateStatus(@PathVariable("id") Long id, @RequestParam("status") String status) {
		Lead l = lr.findById(id).orElseThrow(() -> new ResourceNotFound("Lead Not Found with Id: " + id));
		l.setStatus(status);
		return lr.save(l);

	}
}
