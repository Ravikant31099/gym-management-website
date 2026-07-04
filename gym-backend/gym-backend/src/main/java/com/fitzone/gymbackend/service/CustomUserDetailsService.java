package com.fitzone.gymbackend.service;

import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.fitzone.gymbackend.entity.User;
import com.fitzone.gymbackend.repository.UserRepository;

@Service
public class CustomUserDetailsService {
	private final UserRepository userRepository;

	public CustomUserDetailsService(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	public User loadUserByEmail(String email) {
		return userRepository.findByEmailIgnoreCaseAndActiveTrue(email)
				.orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));
	}
}
