package com.fitzone.gymbackend.constant;

import java.util.List;

public class CustomerConstants {
	public static final String ACTIVE = "ACTIVE";
	public static final String INACTIVE = "INACTIVE";
	public static final List<Integer> ALLOWED_PLAN_PERIOD  = List.of(1, 3, 6, 9, 12);
	public static final List<String> VALID_STATUSES = List.of("PAID", "PENDING", "FAILED");
	public static final List<String> VALID_MODES  = List.of("CASH", "UPI", "CARD", "BANK_TRANSFER");
	public static final List<String> ALLOWED_LEAD_STATUS = List.of("NEW", "CONTACTED", "FOLLOW-UP", "JOINED",
			"NOT-INTERESTED");
	public static final List<String> ALLOWED_SORT_FIELDS = List.of("name", "expiryDate", "status", "plan");
	private CustomerConstants() {
	}
}
