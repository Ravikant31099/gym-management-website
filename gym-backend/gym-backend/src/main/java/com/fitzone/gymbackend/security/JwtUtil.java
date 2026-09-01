package com.fitzone.gymbackend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fitzone.gymbackend.entity.User;

@Component
public class JwtUtil {

	private static final int MIN_SECRET_BYTES = 32; // 256-bit minimum for HS256

	private final Key key;
	private final long expiryMs;

	public JwtUtil(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiry-ms:3600000}") long expiryMs) {
		if (secret == null || secret.getBytes().length < MIN_SECRET_BYTES) {
			throw new IllegalStateException(
					"app.jwt.secret must be configured and at least " + MIN_SECRET_BYTES + " bytes long");
		}
		if (expiryMs <= 0) {
			throw new IllegalStateException("app.jwt.expiry-ms must be a positive value");
		}
		this.key = Keys.hmacShaKeyFor(secret.getBytes());
		this.expiryMs = expiryMs;
	}

	public String generateToken(User user) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + expiryMs);
		return Jwts.builder().setSubject(user.getEmail()).claim("role", user.getRole().name())
				.claim("uid", user.getId()).setIssuedAt(now).setExpiration(expiry).signWith(key).compact();
	}

	public String extractUserName(String token) {
		return parseClaims(token).getSubject();
	}

	public String extractRole(String token) {
		return parseClaims(token).get("role", String.class);
	}

	/**
	 * Validates signature and expiry. Never throws — callers rely on the boolean
	 * result so a malformed/expired/tampered token is always treated uniformly as
	 * "unauthenticated".
	 */
	public boolean validateToken(String token) {
		if (token == null || token.isBlank()) {
			return false;
		}
		try {
			parseClaims(token);
			return true;
		} catch (JwtException | IllegalArgumentException e) {
			return false;
		}
	}

	private Claims parseClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
	}
}