package com.fitzone.gymbackend.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import static com.fitzone.gymbackend.constant.ApiPath.*;

@Configuration
public class SecurityConfig {

	private final JwtFilter jf;

	public SecurityConfig(JwtFilter jf) {
		this.jf = jf;
	}

	@Bean
	public SecurityFilterChain sfc(HttpSecurity http) throws Exception {
		http.cors(cors -> cors.configurationSource(ccs())).csrf(csrf -> csrf.disable())
				.sessionManagement(se -> se.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(
						auth -> auth.requestMatchers(AUTH).permitAll()
						.requestMatchers(HttpMethod.GET, PUBLIC_PLANS).permitAll()
						.requestMatchers(LEADS).authenticated()
						.requestMatchers(PLANS).authenticated().anyRequest().authenticated())
				.addFilterBefore(jf, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public CorsConfigurationSource ccs() {
		CorsConfiguration conf = new CorsConfiguration();
		conf.setAllowedOrigins(List.of("http://localhost:5173"));
		conf.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		conf.setAllowedHeaders(List.of("*"));
		conf.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource ubs = new UrlBasedCorsConfigurationSource();
		ubs.registerCorsConfiguration("/**", conf);
		return ubs;
	}
}
