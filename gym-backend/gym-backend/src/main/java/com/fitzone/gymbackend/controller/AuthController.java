package com.fitzone.gymbackend.controller;

import com.fitzone.gymbackend.dto.LoginRequest;
import com.fitzone.gymbackend.dto.LoginResponse;
import com.fitzone.gymbackend.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
public class AuthController {
	private final AuthenticationService authenticationService;

	public AuthController(AuthenticationService authenticationService) {
		this.authenticationService = authenticationService;
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
		return ResponseEntity.ok(authenticationService.login(loginRequest));
	}

}
