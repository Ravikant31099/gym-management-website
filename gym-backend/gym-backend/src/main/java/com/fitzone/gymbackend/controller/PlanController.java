package com.fitzone.gymbackend.controller;

import com.fitzone.gymbackend.dto.PlanRequest;
import com.fitzone.gymbackend.dto.PlanResponse;
import com.fitzone.gymbackend.service.PlanService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class PlanController {

	private final PlanService planService;

	public PlanController(PlanService planService) {
		this.planService = planService;
	}

	@GetMapping
	public ResponseEntity<List<PlanResponse>> getAllPlans() {
		return ResponseEntity.ok(planService.getAllPlans());
	}

	@PostMapping
	public ResponseEntity<PlanResponse> createPlan(@RequestBody @Valid PlanRequest p) {
		return ResponseEntity.status(HttpStatus.CREATED).body(planService.createPlan(p));
	}

	@PutMapping("/{id}")
	public ResponseEntity<PlanResponse> updatePlan(
			@PathVariable("id") Long id,
			@RequestBody @Valid PlanRequest p) {
		return ResponseEntity.ok(planService.updateExistingPlan(id, p));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deletePlan(@PathVariable("id") Long id) {
		try {
			planService.deletePlan(id);
			return ResponseEntity.ok().build();
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}
