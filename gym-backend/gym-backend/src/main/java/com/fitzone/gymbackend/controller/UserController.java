package com.fitzone.gymbackend.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fitzone.gymbackend.dto.UserActivityResponse;
import com.fitzone.gymbackend.dto.UserDetailsResponse;
import com.fitzone.gymbackend.dto.UserExportResponse;
import com.fitzone.gymbackend.dto.UserImageUploadResponse;
import com.fitzone.gymbackend.dto.UserRequest;
import com.fitzone.gymbackend.dto.UserResponse;
import com.fitzone.gymbackend.dto.UserUpdateRequest;
import com.fitzone.gymbackend.enums.UserRole;
import com.fitzone.gymbackend.service.AuditLogService;
import com.fitzone.gymbackend.service.UserService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;
	private final AuditLogService auditLogService;

	public UserController(UserService userService, AuditLogService auditLogService) {
		this.userService = userService;
		this.auditLogService = auditLogService;
	}

	@GetMapping
	public ResponseEntity<Page<UserResponse>> getUsers(@RequestParam(name = "search", required = false) String search,
			@RequestParam(name = "role", required = false) UserRole role,
			@RequestParam(name = "active", required = false) Boolean active,
			@PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
		return ResponseEntity.ok(userService.getUsers(search, role, active, pageable));
	}

	@PostMapping
	public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
		return ResponseEntity.status(HttpStatus.CREATED).body(userService.createUser(request));
	}

	@PutMapping("/{id}")
	public ResponseEntity<UserResponse> updateUser(@PathVariable("id") @Positive Long id,
			@Valid @RequestBody UserUpdateRequest request) {
		return ResponseEntity.ok(userService.updateExistingUser(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable("id") @Positive Long id) {
		userService.deleteUser(id);
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/{id}/status")
	public ResponseEntity<UserResponse> updateUserStatus(@PathVariable("id") @Positive Long id,
			@RequestParam Boolean active) {
		return ResponseEntity.ok(userService.updateUserStatus(id, active));
	}

	@GetMapping("/export")
	public ResponseEntity<List<UserExportResponse>> exportUsers(
			@RequestParam(name = "search", required = false) String search,
			@RequestParam(name = "role", required = false) UserRole role,
			@RequestParam(name = "active", required = false) Boolean active) {
		return ResponseEntity.ok(userService.exportUsers(search, role, active));
	}

	@GetMapping("/{id}")
	public ResponseEntity<UserDetailsResponse> getUserDetails(@PathVariable("id") @Positive Long id) {
		return ResponseEntity.ok(userService.getUserDetails(id));
	}

	@GetMapping("/{id}/activities")
	public ResponseEntity<List<UserActivityResponse>> getUserActivities(@PathVariable("id") @Positive Long id) {
		return ResponseEntity.ok(auditLogService.getUserActivities(id));
	}

	@PostMapping("/{id}/upload-image")
	public ResponseEntity<UserImageUploadResponse> uploadUserImage(@PathVariable("id") @Positive Long id,
			@RequestParam("file") MultipartFile file) throws IOException {
		return ResponseEntity.ok(userService.uploadUserImage(id, file));
	}
}