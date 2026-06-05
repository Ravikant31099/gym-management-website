package com.fitzone.gymbackend.controller;

import com.fitzone.gymbackend.dto.PlanRequest;
import com.fitzone.gymbackend.dto.PlanResponse;
import com.fitzone.gymbackend.entity.Plan;
import com.fitzone.gymbackend.service.PlanService;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/plans")
public class PlanController {
	private final PlanService ps;

	public PlanController(PlanService ps) {
		this.ps = ps;
	}

	@GetMapping
	public ResponseEntity<List<PlanResponse>> getAllPlans() {
		return ResponseEntity.ok(ps.getAllPlans());
	}

	@PostMapping
	public ResponseEntity<PlanResponse> createPlan(@RequestBody @Valid PlanRequest p) {
		return ResponseEntity.ok(ps.createPlan(p));
	}

	@PutMapping("/{id}")
	public ResponseEntity<PlanResponse> updatePlan(@PathVariable("id") @Valid Long id, @RequestBody Plan p) {
		return ResponseEntity.ok(ps.updatExistingPlan(id, p));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deletePlan(@PathVariable("id") Long id) {
		try {
			ps.deletePlan(id);
			return ResponseEntity.ok().build();
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}
