package com.fitzone.gymbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class FileStorageConfig implements WebMvcConfigurer {

	private final StorageProperties storageProperties;

	public FileStorageConfig(StorageProperties storageProperties) {
		this.storageProperties = storageProperties;
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/customer-images/**")
				.addResourceLocations("file:" + storageProperties.getRootPath() + "/customer-images/");
	}
}
