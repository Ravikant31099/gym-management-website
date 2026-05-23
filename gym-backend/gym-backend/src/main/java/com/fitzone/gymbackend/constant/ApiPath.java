package com.fitzone.gymbackend.constant;

public class ApiPath {

	private ApiPath() {
	}
	public static final String AUTH = "/api/auth/**";
	public static final String LEADS = "/api/leads/**";
	public static final String PLANS = "/api/plans/**";	
	public static final String GETPLANS = "/api/plans";
	public static final String POSTLEADS = "/api/leads";
	public static final int Token_Expiry_Time = 1000 * 60;
}
