package com.fitzone.gymbackend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fitzone.gymbackend.config.StorageProperties;
import com.fitzone.gymbackend.constant.StorageFolders;
import com.fitzone.gymbackend.dto.UserDetailsResponse;
import com.fitzone.gymbackend.dto.UserExportResponse;
import com.fitzone.gymbackend.dto.UserImageUploadResponse;
import com.fitzone.gymbackend.dto.UserRequest;
import com.fitzone.gymbackend.dto.UserResponse;
import com.fitzone.gymbackend.dto.UserUpdateRequest;
import com.fitzone.gymbackend.entity.User;
import com.fitzone.gymbackend.enums.ActivityType;
import com.fitzone.gymbackend.enums.UserRole;
import com.fitzone.gymbackend.exception.BusinessException;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserService {

	private static final int MAX_PAGE_SIZE = 100;

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final AuditLogService auditLogService;
	private final StorageProperties storageProperties;

	public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuditLogService auditLogService,
			StorageProperties storageProperties) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.auditLogService = auditLogService;
		this.storageProperties = storageProperties;
	}

	public List<UserResponse> getAllUsers() {
		return userRepository.findByActiveTrue().stream().map(this::userMapToResponse).toList();
	}

	public Page<UserResponse> getUsers(String search, UserRole role, Boolean active, Pageable pageable) {
		String normalizedSearch = search == null || search.isBlank() ? null : search.trim();
		Pageable safePageable = clampPageable(pageable);
		return userRepository.findUsers(normalizedSearch, role, active, safePageable).map(this::userMapToResponse);
	}

	@Transactional
	public UserResponse createUser(UserRequest request) {
		String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);
		if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
			throw new BusinessException("Email already exists.");
		}
		User user = new User();
		user.setName(request.getName().trim());
		user.setEmail(normalizedEmail);
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setRole(request.getRole());
		user.setActive(true);
		User savedUser = userRepository.save(user);
		auditLogService.logActivity("USER", savedUser.getId(), ActivityType.USER_CREATE,
				"User created: " + savedUser.getEmail());
		return userMapToResponse(savedUser);
	}

	@Transactional
	public UserResponse updateExistingUser(Long id, UserUpdateRequest request) {
		User existing = userRepository.findById(id).orElseThrow(() -> new ResourceNotFound("User not found."));
		String normalizedEmail = request.getEmail().trim().toLowerCase(Locale.ROOT);
		if (userRepository.existsByEmailIgnoreCaseAndIdNot(normalizedEmail, id)) {
			throw new BusinessException("Email already exists.");
		}
		existing.setName(request.getName().trim());
		existing.setEmail(normalizedEmail);
		existing.setRole(request.getRole());
		User savedUser = userRepository.save(existing);
		auditLogService.logActivity("USER", savedUser.getId(), ActivityType.USER_UPDATE,
				"User updated: " + savedUser.getEmail());
		return userMapToResponse(savedUser);
	}

	@Transactional
	public void deleteUser(Long id) {
		User user = userRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> new ResourceNotFound("User not found."));
		String currentUserEmail = currentUsername();
		if (user.getEmail().equalsIgnoreCase(currentUserEmail)) {
			throw new BusinessException("You cannot delete your own account.");
		}
		user.setDeleted(true);
		user.setActive(false);
		userRepository.save(user);
		auditLogService.logActivity("USER", user.getId(), ActivityType.USER_DEACTIVATE,
				"User deleted: " + user.getEmail());
	}

	@Transactional
	public UserResponse updateUserStatus(Long id, Boolean active) {
		if (active == null) {
			throw new BusinessException("active is required");
		}
		User user = userRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> new ResourceNotFound("User not found."));
		String currentUserEmail = currentUsername();
		if (user.getEmail().equalsIgnoreCase(currentUserEmail)) {
			throw new BusinessException("You cannot change your own account status.");
		}
		user.setActive(active);
		User savedUser = userRepository.save(user);
		auditLogService.logActivity("USER", savedUser.getId(), ActivityType.USER_STATUS_UPDATE,
				active ? "User activated: " + savedUser.getEmail() : "User deactivated: " + savedUser.getEmail());
		return userMapToResponse(savedUser);
	}

	public List<UserExportResponse> exportUsers(String search, UserRole role, Boolean active) {
		List<User> users = userRepository
				.findUsers(search == null || search.isBlank() ? null : search.trim(), role, active, Pageable.unpaged())
				.getContent();
		return users.stream().map(user -> {
			UserExportResponse response = new UserExportResponse();
			response.setId(user.getId());
			response.setName(user.getName());
			response.setEmail(user.getEmail());
			response.setRole(user.getRole().name());
			response.setStatus(user.getActive() ? "Active" : "Inactive");
			response.setCreatedAt(user.getCreatedAt() != null ? user.getCreatedAt().toString() : "");
			return response;
		}).toList();
	}

	public UserDetailsResponse getUserDetails(Long id) {
		User user = userRepository.findByIdAndDeletedFalse(id)
				.orElseThrow(() -> new ResourceNotFound("User not found."));
		return new UserDetailsResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getActive(),
				user.getCreatedAt(), user.getUpdatedAt(), user.getProfileImageUrl(), user.getImageUpdatedAt(),
				user.getImageUpdatedBy());
	}

	@Transactional
	public UserImageUploadResponse uploadUserImage(Long userId, MultipartFile file) throws IOException {
		User user = userRepository.findByIdAndDeletedFalse(userId)
				.orElseThrow(() -> new ResourceNotFound("User not found."));

		validateImageFile(file);

		Path uploadPath = Paths.get(storageProperties.getRootPath(), StorageFolders.USER_IMAGES).normalize();
		if (!Files.exists(uploadPath)) {
			Files.createDirectories(uploadPath);
		}
		String extension = safeExtension(file.getOriginalFilename());
		String fileName = "user-" + userId + extension;
		Path filePath = uploadPath.resolve(fileName).normalize();
		if (!filePath.startsWith(uploadPath)) {
			throw new BusinessException("Invalid file path");
		}
		Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

		String imageUrl = "/user-images/" + fileName;
		LocalDateTime updatedAt = LocalDateTime.now();
		String username = currentUsername();
		user.setProfileImageUrl(imageUrl);
		user.setImageUpdatedAt(updatedAt);
		user.setImageUpdatedBy(username);
		User savedUser = userRepository.save(user);
		auditLogService.logActivity("USER", savedUser.getId(), ActivityType.USER_PROFILE_UPLOADED,
				"User '" + savedUser.getName() + "' image uploaded.");
		return new UserImageUploadResponse(savedUser.getId(), savedUser.getName(), imageUrl, updatedAt, username,
				"User image uploaded successfully");
	}

	private UserResponse userMapToResponse(User user) {
		return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole(), user.getActive(),
				user.getProfileImageUrl(), user.getImageUpdatedAt(), user.getImageUpdatedBy());
	}

	private void validateImageFile(MultipartFile file) {
		if (file == null || file.isEmpty()) {
			throw new BusinessException("Image file is required.");
		}
		if (file.getSize() > StorageFolders.MAX_IMAGE_SIZE_BYTES) {
			throw new BusinessException("Image exceeds the maximum allowed size of 5MB");
		}
		String contentType = file.getContentType();
		if (contentType == null || !contentType.startsWith("image/")) {
			throw new BusinessException("Only image files are allowed.");
		}
		String extension = safeExtension(file.getOriginalFilename());
		if (!StorageFolders.ALLOWED_IMAGE_EXTENSIONS.contains(extension)) {
			throw new BusinessException("Unsupported image type. Allowed types: "
					+ String.join(", ", StorageFolders.ALLOWED_IMAGE_EXTENSIONS));
		}
	}

	private String safeExtension(String originalFilename) {
		if (originalFilename == null || originalFilename.isBlank()) {
			return "";
		}
		String sanitized = Paths.get(originalFilename).getFileName().toString();
		int dotIndex = sanitized.lastIndexOf('.');
		if (dotIndex < 0 || dotIndex == sanitized.length() - 1) {
			return "";
		}
		return sanitized.substring(dotIndex).toLowerCase(Locale.ROOT);
	}

	private String currentUsername() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		return auth != null ? auth.getName() : "SYSTEM";
	}

	private Pageable clampPageable(Pageable pageable) {
		int safeSize = pageable.getPageSize() <= 0 ? 10 : Math.min(pageable.getPageSize(), MAX_PAGE_SIZE);
		if (safeSize == pageable.getPageSize()) {
			return pageable;
		}
		return PageRequest.of(pageable.getPageNumber(), safeSize, pageable.getSort());
	}
}