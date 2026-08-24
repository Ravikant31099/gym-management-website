package com.fitzone.gymbackend.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.fitzone.gymbackend.dto.UserRequest;
import com.fitzone.gymbackend.dto.UserResponse;
import com.fitzone.gymbackend.dto.UserUpdateRequest;
import com.fitzone.gymbackend.enums.UserRole;
import com.fitzone.gymbackend.service.AuditLogService;
import com.fitzone.gymbackend.service.UserService;
import com.fitzone.gymbackend.dto.UserActivityResponse;
import com.fitzone.gymbackend.dto.UserDetailsResponse;
import com.fitzone.gymbackend.dto.UserExportResponse;
import com.fitzone.gymbackend.dto.UserImageUploadResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.io.IOException;
import org.springframework.web.multipart.MultipartFile;

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
	public ResponseEntity<UserResponse> updateUser(@PathVariable("id") Long id,
			@Valid @RequestBody UserUpdateRequest request) {
		return ResponseEntity.ok(userService.updateExistingUser(id, request));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable("id") Long id) {
		userService.deleteUser(id);
		return ResponseEntity.noContent().build();
	}

	@PatchMapping("/{id}/status")
	public ResponseEntity<UserResponse> updateUserStatus(@PathVariable("id") Long id, @RequestParam Boolean active) {
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
	public ResponseEntity<UserDetailsResponse> getUserDetails(@PathVariable("id") Long id) {
		return ResponseEntity.ok(userService.getUserDetails(id));
	}

	@GetMapping("/{id}/activities")
	public ResponseEntity<List<UserActivityResponse>> getUserActivities(@PathVariable("id") Long id) {
		return ResponseEntity.ok(auditLogService.getUserActivities(id));
	}
	
	@PostMapping("/{id}/upload-image")
	public ResponseEntity<UserImageUploadResponse> uploadUserImage(
	        @PathVariable("id") Long id,
	        @RequestParam("file") MultipartFile file) throws IOException {

	    return ResponseEntity.ok(
	            userService.uploadUserImage(id, file)
	    );
	}
}
