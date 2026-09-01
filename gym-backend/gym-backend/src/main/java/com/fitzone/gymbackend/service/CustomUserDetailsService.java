package com.fitzone.gymbackend.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.fitzone.gymbackend.entity.User;
import com.fitzone.gymbackend.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

	private final UserRepository userRepository;

	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		String normalizedEmail = email == null ? "" : email.trim();
		User user = userRepository.findByEmailIgnoreCaseAndActiveTrueAndDeletedFalse(normalizedEmail)
				.orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));
		return org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
				.password(user.getPassword()).roles(user.getRole().name()).build();
	}
}