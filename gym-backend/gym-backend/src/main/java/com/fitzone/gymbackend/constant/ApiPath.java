package com.fitzone.gymbackend.constant;

public class ApiPath {

	private ApiPath() {
	}

	public static final String AUTH = "/api/auth/**";
	public static final String LEADS = "/api/leads/**";
	public static final String PLANS = "/api/plans/**";
	public static final String GETPLANS = "/api/plans";
	public static final String POSTLEADS = "/api/leads";
	public static final String CUSTOMERS = "/api/customers/**";
	public static final String CUSTOMERIMAGE = "/customer-images/*";
	public static final String PAYMENTS = "/api/payments/**";
	public static final String USERS = "/api/users/**";
	public static final String USERIMAGE = "/user-images/*";
	public static final String DASHBOARD = "/api/dashboard/**";
}
