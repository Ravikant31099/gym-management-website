package com.fitzone.gymbackend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.fitzone.gymbackend.dto.LoginRequest;
import com.fitzone.gymbackend.dto.LoginResponse;
import com.fitzone.gymbackend.entity.User;
import com.fitzone.gymbackend.enums.ActivityType;
import com.fitzone.gymbackend.repository.UserRepository;
import com.fitzone.gymbackend.security.JwtUtil;
import com.fitzone.gymbackend.security.LoginRateLimiter;

/**
 * Handles login. Two changes vs. the audited version:
 *
 *  1. Brute-force protection: login attempts are now rate-limited per (client IP + email)
 *     via LoginRateLimiter. A blocked key is rejected before AuthenticationManager is even
 *     invoked, and a failed authentication records a strike; a successful login clears the
 *     counter. This closes the "no lockout" gap flagged in the audit.
 *  2. User enumeration hardening: whether the email doesn't exist, the account is
 *     inactive/deleted, or the password is wrong, the caller now sees the exact same
 *     generic "Invalid email or password" outcome (via BadCredentialsException, mapped to
 *     401 by GlobalExceptionHandler) — the previous version threw a distinct
 *     ResourceNotFound("User not found.") for the "authenticated but no matching active
 *     user row" case, which is a different HTTP status/message an attacker could use to
 *     distinguish "this email doesn't exist" from "wrong password".
 */
@Service
public class AuthenticationService {

	private final AuthenticationManager authenticationManager;
	private final UserRepository userRepository;
	private final JwtUtil jwtUtil;
	private final AuditLogService auditLogService;
	private final LoginRateLimiter loginRateLimiter;

	public AuthenticationService(AuthenticationManager authenticationManager, UserRepository userRepository,
			JwtUtil jwtUtil, AuditLogService auditLogService, LoginRateLimiter loginRateLimiter) {
		this.authenticationManager = authenticationManager;
		this.userRepository = userRepository;
		this.jwtUtil = jwtUtil;
		this.auditLogService = auditLogService;
		this.loginRateLimiter = loginRateLimiter;
	}

	public LoginResponse login(LoginRequest loginRequest, String clientIp) {
		String normalizedEmail = loginRequest.getEmail() == null ? "" : loginRequest.getEmail().trim().toLowerCase();
		String rateLimitKey = clientIp + ":" + normalizedEmail;

		if (loginRateLimiter.isBlocked(rateLimitKey)) {
			long retryAfterSeconds = loginRateLimiter.remainingBlockSeconds(rateLimitKey);
			throw new BadCredentialsException(
					"Too many failed login attempts. Try again in " + retryAfterSeconds + " seconds.");
		}

		try {
			Authentication authentication = authenticationManager
					.authenticate(new UsernamePasswordAuthenticationToken(normalizedEmail, loginRequest.getPassword()));
			SecurityContextHolder.getContext().setAuthentication(authentication);
			UserDetails userDetails = (UserDetails) authentication.getPrincipal();

			User user = userRepository.findByEmailIgnoreCaseAndActiveTrueAndDeletedFalse(userDetails.getUsername())
					.orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

			loginRateLimiter.recordSuccess(rateLimitKey);
			String token = jwtUtil.generateToken(user);
			auditLogService.logActivity("AUTHENTICATION", user.getId(), ActivityType.LOGIN,
					"User logged into the system");
			return new LoginResponse(token, user.getName(), user.getEmail(), user.getRole());
		} catch (org.springframework.security.core.AuthenticationException e) {
			loginRateLimiter.recordFailure(rateLimitKey);
			throw new BadCredentialsException("Invalid email or password");
		}
	}
}