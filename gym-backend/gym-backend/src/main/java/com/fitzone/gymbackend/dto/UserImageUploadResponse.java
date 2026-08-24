package com.fitzone.gymbackend.dto;

import java.time.LocalDateTime;

public class UserImageUploadResponse {
	private Long id;
	private String name;
	private String imageUrl;
	private LocalDateTime imageUpdatedAt;
	private String imageUpdatedBy;
	private String message;

	public UserImageUploadResponse() {
		super();
	}

	public UserImageUploadResponse(Long id, String name, String imageUrl, LocalDateTime imageUpdatedAt,
			String imageUpdatedBy, String message) {
		this.id = id;
		this.name = name;
		this.imageUrl = imageUrl;
		this.imageUpdatedAt = imageUpdatedAt;
		this.imageUpdatedBy = imageUpdatedBy;
		this.message = message;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}

	public LocalDateTime getImageUpdatedAt() {
		return imageUpdatedAt;
	}

	public void setImageUpdatedAt(LocalDateTime imageUpdatedAt) {
		this.imageUpdatedAt = imageUpdatedAt;
	}

	public String getImageUpdatedBy() {
		return imageUpdatedBy;
	}

	public void setImageUpdatedBy(String imageUpdatedBy) {
		this.imageUpdatedBy = imageUpdatedBy;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
