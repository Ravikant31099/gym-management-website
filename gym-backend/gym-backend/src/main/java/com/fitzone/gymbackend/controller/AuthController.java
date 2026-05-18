package com.fitzone.gymbackend.controller;

import com.fitzone.gymbackend.dto.LoginRequest;
import com.fitzone.gymbackend.security.JwtUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("api/auth")
public class AuthController {
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest lr) {
		if (lr.getUsername().equals("admin") && lr.getPassword().equals("admin")) {
			String tkn = JwtUtil.generateToken(lr.getUsername());
			return ResponseEntity.ok(Map.of("token", tkn));
		}
		return ResponseEntity.badRequest().body(Map.of("Error_Message", "Invalid Credentials"));
	}
}
