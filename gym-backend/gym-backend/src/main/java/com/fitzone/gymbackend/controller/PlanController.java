package com.fitzone.gymbackend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.fitzone.gymbackend.dto.PlanRequest;
import com.fitzone.gymbackend.dto.PlanResponse;
import com.fitzone.gymbackend.service.PlanService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/plans")
@Validated
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
	public ResponseEntity<PlanResponse> updatePlan(@PathVariable("id") @Positive Long id,
			@RequestBody @Valid PlanRequest p) {
		return ResponseEntity.ok(planService.updateExistingPlan(id, p));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletePlan(@PathVariable("id") @Positive Long id) {
		planService.deactivatePlan(id);
		return ResponseEntity.ok().build();
	}

	@GetMapping("/export")
	public ResponseEntity<List<PlanResponse>> exportPlans() {
		return ResponseEntity.ok(planService.exportPlans());
	}
}