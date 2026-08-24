package com.fitzone.gymbackend.security;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.fitzone.gymbackend.exception.SecurityAuthenticationEntryPoint;
import static com.fitzone.gymbackend.constant.ApiPath.*;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final JwtFilter jf;
	private final SecurityAuthenticationEntryPoint sae;

	public SecurityConfig(JwtFilter jf, SecurityAuthenticationEntryPoint sae) {
		this.jf = jf;
		this.sae = sae;
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}

	@Bean
	public SecurityFilterChain sfc(HttpSecurity http) throws Exception {
		http.cors(cors -> cors.configurationSource(ccs())).csrf(csrf -> csrf.disable())
				.sessionManagement(se -> se.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(auth -> auth.requestMatchers(AUTH).permitAll()
						.requestMatchers(HttpMethod.GET, GETPLANS).permitAll()
						.requestMatchers(HttpMethod.POST, POSTLEADS).permitAll().requestMatchers(CUSTOMERIMAGE)
						.permitAll().requestMatchers(USERIMAGE).permitAll().requestMatchers(USERS).hasRole("ADMIN")
						.requestMatchers(CUSTOMERS).hasAnyRole("ADMIN", "RECEPTIONIST").requestMatchers(LEADS)
						.hasAnyRole("ADMIN", "RECEPTIONIST").requestMatchers(PLANS).hasAnyRole("ADMIN", "RECEPTIONIST")
						.requestMatchers(PAYMENTS).hasAnyRole("ADMIN", "RECEPTIONIST").anyRequest().authenticated())
				.exceptionHandling(exception -> exception.authenticationEntryPoint(sae))
				.addFilterBefore(jf, UsernamePasswordAuthenticationFilter.class);
		return http.build();
	}

	@Bean
	public CorsConfigurationSource ccs() {
		CorsConfiguration conf = new CorsConfiguration();
		conf.setAllowedOrigins(List.of("http://localhost:5173"));
		conf.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
		conf.setAllowedHeaders(List.of("*"));
		conf.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource ubs = new UrlBasedCorsConfigurationSource();
		ubs.registerCorsConfiguration("/**", conf);
		return ubs;
	}
}
