package com.fitzone.gymbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import jakarta.annotation.PostConstruct;

@Configuration
public class FileStorageConfig implements WebMvcConfigurer {

	private final StorageProperties storageProperties;

	public FileStorageConfig(StorageProperties storageProperties) {
		this.storageProperties = storageProperties;
	}

	@PostConstruct
	public void validateConfiguration() {
		String rootPath = storageProperties.getRootPath();
		if (rootPath == null || rootPath.isBlank()) {
			throw new IllegalStateException(
					"app.storage.root-path must be configured (set the APP_STORAGE_ROOT_PATH environment variable)");
		}
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		String normalizedRoot = normalize(storageProperties.getRootPath());
		registry.addResourceHandler("/customer-images/**")
				.addResourceLocations("file:" + normalizedRoot + "/customer-images/");
		registry.addResourceHandler("/user-images/**").addResourceLocations("file:" + normalizedRoot + "/user-images/");
	}

	private String normalize(String path) {
		return path.endsWith("/") ? path.substring(0, path.length() - 1) : path;
	}
}