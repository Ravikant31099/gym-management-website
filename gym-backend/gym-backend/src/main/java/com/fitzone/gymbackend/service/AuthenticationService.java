package com.fitzone.gymbackend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.fitzone.gymbackend.dto.LoginRequest;
import com.fitzone.gymbackend.dto.LoginResponse;
import com.fitzone.gymbackend.entity.User;
import com.fitzone.gymbackend.enums.ActivityType;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.repository.UserRepository;
import com.fitzone.gymbackend.security.JwtUtil;

@Service
public class AuthenticationService {
	private final AuthenticationManager authenticationManager;
	private final UserRepository userRepository;
	private final JwtUtil jwtUtil;
	private final AuditLogService auditLogService;

	public AuthenticationService(AuthenticationManager authenticationManager, UserRepository userRepository,
			JwtUtil jwtUtil, AuditLogService auditLogService) {
		this.authenticationManager = authenticationManager;
		this.userRepository = userRepository;
		this.jwtUtil = jwtUtil;
		this.auditLogService = auditLogService;
	}

	public LoginResponse login(LoginRequest loginRequest) {
		Authentication authentication = authenticationManager.authenticate(
				new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));
		SecurityContextHolder.getContext().setAuthentication(authentication);
		UserDetails userDetails = (UserDetails) authentication.getPrincipal();
		User user = userRepository.findByEmailIgnoreCaseAndActiveTrueAndDeletedFalse(userDetails.getUsername())
				.orElseThrow(() -> new ResourceNotFound("User not found."));
		String token = jwtUtil.generateToken(user);
		auditLogService.logActivity("AUTHENTICATION", user.getId(), ActivityType.LOGIN, "User logged into the system");
		return new LoginResponse(token, user.getName(), user.getEmail(), user.getRole());
	}

}
