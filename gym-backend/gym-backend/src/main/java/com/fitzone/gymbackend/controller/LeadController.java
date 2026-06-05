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
	public ResponseEntity<String> deleteLead(@PathVariable("id") Long id) {
		Lead l = lr.findById(id).orElseThrow(() -> new ResourceNotFound("Lead Not Found with Id: " + id));
		try {
			lr.delete(l);
			return ResponseEntity.ok().build();
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}

	}

	@PutMapping("/{id}/status")
	public Lead updateStatus(@PathVariable("id") Long id, @RequestParam("status") String status) {
		Lead l = lr.findById(id).orElseThrow(() -> new ResourceNotFound("Lead Not Found with Id: " + id));
		l.setStatus(status);
		return lr.save(l);

	}
}
