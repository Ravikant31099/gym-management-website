package com.fitzone.gymbackend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;
import io.jsonwebtoken.security.Keys;
import java.security.Key;

public class JwtUtil {
	private static final String SECURITY_KEY = "Fitzone_Security_JWT_Token_Key_Generator_9890123";
	private static final Key key = Keys.hmacShaKeyFor(SECURITY_KEY.getBytes());

	public static String generateToken(String usrname) {
		return Jwts.builder().setSubject(usrname).setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60))
				.signWith(SignatureAlgorithm.HS256, key).compact();
	}

	public static String extractUserName(String token) {
		return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
	}

	public static boolean ValidateToken(String token) {
		try {
			Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
}
