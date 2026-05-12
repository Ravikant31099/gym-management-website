package com.fitzone.gymbackend.controller;

import com.fitzone.gymbackend.entity.Lead;
import com.fitzone.gymbackend.repository.LeadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

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
}
