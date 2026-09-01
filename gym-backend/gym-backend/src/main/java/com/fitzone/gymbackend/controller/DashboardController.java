package com.fitzone.gymbackend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fitzone.gymbackend.dto.DashboardResponse;
import com.fitzone.gymbackend.service.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

	private final DashboardService dashboardService;

	public DashboardController(DashboardService dashboardService) {
		this.dashboardService = dashboardService;
	}

	@GetMapping
	public ResponseEntity<DashboardResponse> getDashboard() {
		return ResponseEntity.ok(dashboardService.getDashboard());
	}
}