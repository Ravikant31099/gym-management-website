package com.fitzone.gymbackend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.fitzone.gymbackend.entity.User;
import com.fitzone.gymbackend.enums.UserRole;
import com.fitzone.gymbackend.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	@Value("${app.bootstrap.admin.name}")
	private String adminName;

	@Value("${app.bootstrap.admin.email}")
	private String adminEmail;

	@Value("${app.bootstrap.admin.password}")
	private String adminPassword;

	public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public void run(String... args) {
		if (!userRepository.existsByEmailIgnoreCase(adminEmail)) {
			User admin = new User();
			admin.setName(adminName);
			admin.setEmail(adminEmail);
			admin.setPassword(passwordEncoder.encode(adminPassword));
			admin.setRole(UserRole.ADMIN);
			admin.setActive(true);
			userRepository.save(admin);
		}
	}
}
