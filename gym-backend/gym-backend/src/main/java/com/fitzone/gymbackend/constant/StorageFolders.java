package com.fitzone.gymbackend.constant;

import java.util.Set;

public final class StorageFolders {

	private StorageFolders() {
	}

	public static final String CUSTOMER_IMAGES = "customer-images";

	public static final String CUSTOMER_EXPORTS = "exports/customers";

	public static final String PAYMENT_EXPORTS = "exports/payments";

	public static final String REPORTS = "reports";

	public static final String BACKUPS = "backups";

	public static final String TEMP = "temp";

	public static final String USER_IMAGES = "user-images";

	public static final Set<String> ALLOWED_IMAGE_EXTENSIONS = Set.of(".jpg", ".jpeg", ".png", ".webp");

	public static final long MAX_IMAGE_SIZE_BYTES = 5L * 1024 * 1024; // 5 MB
}