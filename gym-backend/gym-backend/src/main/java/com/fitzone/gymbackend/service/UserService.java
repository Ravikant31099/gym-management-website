package com.fitzone.gymbackend.service;

import java.util.List;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.fitzone.gymbackend.dto.UserRequest;
import com.fitzone.gymbackend.dto.UserResponse;
import com.fitzone.gymbackend.entity.User;
import com.fitzone.gymbackend.exception.BusinessException;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.repository.UserRepository;

@Service
public class UserService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public List<UserResponse> getAllUsers() {
		return userRepository.findByActiveTrue().stream().map(this::userMapToResponse).toList();
	}

	public UserResponse createUser(UserRequest request) {
		if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
			throw new BusinessException("Email already exists.");
		}
		User user = new User();
		user.setName(request.getName().trim());
		user.setEmail(request.getEmail().trim().toLowerCase());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setRole(request.getRole());
		user.setActive(true);
		return userMapToResponse(userRepository.save(user));
	}

	public UserResponse updateExistingUser(Long id, UserRequest request) {
		User existing = userRepository.findById(id).orElseThrow(() -> new ResourceNotFound("User not found."));
		existing.setName(request.getName().trim());
		existing.setEmail(request.getEmail().trim().toLowerCase());
		existing.setRole(request.getRole());
		return userMapToResponse(userRepository.save(existing));
	}

	public void deactivateUser(Long id) {
		User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFound("User not found."));
		user.setActive(false);
		userRepository.save(user);
	}

	private UserResponse userMapToResponse(User user) {
		return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getActive());
	}

}
