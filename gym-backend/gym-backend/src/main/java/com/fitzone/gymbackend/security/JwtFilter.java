package com.fitzone.gymbackend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;
import java.io.IOException;
import java.util.List;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

@Component
public class JwtFilter extends OncePerRequestFilter {

	private final JwtUtil jwtUtil;
	private HandlerExceptionResolver resolver;

	public JwtFilter(JwtUtil jwtUtil, @Qualifier("handlerExceptionResolver") HandlerExceptionResolver resolver) {
		this.jwtUtil = jwtUtil;
		this.resolver = resolver;
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
					String role = jwtUtil.extractRole(token);
					List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));
					UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(username, null,
							authorities);
					auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(hre));
					SecurityContextHolder.getContext().setAuthentication(auth);
				}
			}
			fc.doFilter(hre, hrs);
		} catch (Exception e) {
			resolver.resolveException(hre, hrs, null, e);
		}
	}
}
