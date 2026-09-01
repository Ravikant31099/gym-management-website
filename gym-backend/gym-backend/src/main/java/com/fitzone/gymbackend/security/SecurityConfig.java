package com.fitzone.gymbackend.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.fitzone.gymbackend.exception.SecurityAuthenticationEntryPoint;

import static com.fitzone.gymbackend.constant.ApiPath.*;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

	private final JwtFilter jwtFilter;
	private final SecurityAuthenticationEntryPoint authenticationEntryPoint;
	private final String[] allowedOrigins;

	public SecurityConfig(JwtFilter jwtFilter, SecurityAuthenticationEntryPoint authenticationEntryPoint,
			@org.springframework.beans.factory.annotation.Value("${app.cors.allowed-origins:http://localhost:5173}") String allowedOriginsCsv) {
		this.jwtFilter = jwtFilter;
		this.authenticationEntryPoint = authenticationEntryPoint;
		this.allowedOrigins = allowedOriginsCsv.split(",");
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http.cors(cors -> cors.configurationSource(corsConfigurationSource())).csrf(csrf -> csrf.disable())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.headers(headers -> headers.contentTypeOptions(contentTypeOptions -> {
				}).frameOptions(frameOptions -> frameOptions.deny())
						.referrerPolicy(referrer -> referrer
								.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
						.httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).maxAgeInSeconds(31536000)))
				.authorizeHttpRequests(auth -> auth.requestMatchers(AUTH).permitAll()
						.requestMatchers(HttpMethod.GET, GETPLANS).permitAll()
						.requestMatchers(HttpMethod.POST, POSTLEADS).permitAll()
						.requestMatchers(HttpMethod.GET, CUSTOMERIMAGE).permitAll()
						.requestMatchers(HttpMethod.GET, USERIMAGE).permitAll().requestMatchers(USERS).hasRole("ADMIN")
						.requestMatchers(CUSTOMERS).hasAnyRole("ADMIN", "RECEPTIONIST").requestMatchers(LEADS)
						.hasAnyRole("ADMIN", "RECEPTIONIST").requestMatchers(PLANS).hasAnyRole("ADMIN", "RECEPTIONIST")
						.requestMatchers(PAYMENTS).hasAnyRole("ADMIN", "RECEPTIONIST").requestMatchers(DASHBOARD)
						.hasAnyRole("ADMIN", "RECEPTIONIST", "TRAINER").anyRequest().authenticated())
				.exceptionHandling(exception -> exception.authenticationEntryPoint(authenticationEntryPoint))
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(List.of(allowedOrigins));
		configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
		configuration.setExposedHeaders(List.of("Content-Disposition"));
		configuration.setAllowCredentials(true);
		configuration.setMaxAge(3600L);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}
}