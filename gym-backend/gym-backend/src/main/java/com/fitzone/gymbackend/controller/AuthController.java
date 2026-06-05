package com.fitzone.gymbackend.controller;

import com.fitzone.gymbackend.dto.LoginRequest;
import com.fitzone.gymbackend.security.JwtUtil;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
public class AuthController {
	private final JwtUtil jwtUtil;
	private final String adminUsername;
	private final String adminPassword;

	public AuthController(JwtUtil jwtUtil, @Value("${app.admin.username}") String adminUsername,
			@Value("${app.admin.password}") String adminPassword) {
		this.jwtUtil = jwtUtil;
		this.adminUsername = adminUsername;
		this.adminPassword = adminPassword;
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest lr) {
		if (lr.getUsername().equals(adminUsername) && lr.getPassword().equals(adminPassword)) {
			String token = jwtUtil.generateToken(lr.getUsername());
			return ResponseEntity.ok(Map.of("token", token));
		}
		return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
	}
}
