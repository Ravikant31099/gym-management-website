package com.fitzone.gymbackend.controller;

import com.fitzone.gymbackend.dto.LoginRequest;
import com.fitzone.gymbackend.dto.LoginResponse;
import com.fitzone.gymbackend.entity.User;
import com.fitzone.gymbackend.exception.BusinessException;
import com.fitzone.gymbackend.security.JwtUtil;
import com.fitzone.gymbackend.service.CustomUserDetailsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
public class AuthController {
	private final JwtUtil jwtUtil;
	private final CustomUserDetailsService customUserDetailsService;
	private final PasswordEncoder passwordEncoder;

	public AuthController(JwtUtil jwtUtil, CustomUserDetailsService customUserDetailsService,
			PasswordEncoder passwordEncoder) {
		this.jwtUtil = jwtUtil;
		this.customUserDetailsService = customUserDetailsService;
		this.passwordEncoder = passwordEncoder;
	}

	@PostMapping("/login")
	public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
		User user = customUserDetailsService.loadUserByEmail(request.getEmail());
		if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
			throw new BusinessException("Invalid Credentials.");
		}
		String token = jwtUtil.generateToken(user.getEmail());
		return ResponseEntity.ok(new LoginResponse(token, user.getName(), user.getEmail(), user.getRole()));
	}

}
