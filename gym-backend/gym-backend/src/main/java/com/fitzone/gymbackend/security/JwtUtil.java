package com.fitzone.gymbackend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

	private final Key key;
	private final long expiryMs;

	public JwtUtil(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expiry-ms:3600000}") long expiryMs) {
		this.key = Keys.hmacShaKeyFor(secret.getBytes());
		this.expiryMs = expiryMs;
	}

	@SuppressWarnings("deprecation")
	public String generateToken(String username) {
		return Jwts.builder().setSubject(username).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + expiryMs)).signWith(SignatureAlgorithm.HS256, key)
				.compact();
	}

	public String extractUserName(String token) {
		return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
	}

	public boolean validateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
}
