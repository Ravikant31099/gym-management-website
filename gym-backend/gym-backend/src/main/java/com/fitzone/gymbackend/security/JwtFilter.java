package com.fitzone.gymbackend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;

	public JwtFilter(JwtUtil jwtUtil) {
		this.jwtUtil = jwtUtil;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest hre, HttpServletResponse hrs, FilterChain fc)
			throws ServletException, IOException {
		String authHeader = hre.getHeader("Authorization");
		try {
			if (authHeader != null && authHeader.startsWith("Bearer ")) {
				String token = authHeader.substring(7);
				if (jwtUtil.validateToken(token)) {
					String username = jwtUtil.extractUserName(token);
					UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null,
							Collections.emptyList());
					auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(hre));
					SecurityContextHolder.getContext().setAuthentication(auth);
				}
			}
			fc.doFilter(hre, hrs);
		} catch (Exception e) {
			hrs.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			hrs.setContentType("application/json");
			hrs.getWriter().write("""
					{
						"message" : "Token expired or Invalid"
					}""");
		}
	}
}
