package com.fitzone.gymbackend.dto;

import java.time.LocalDate;

public class RecentCustomerResponse {
	private Long id;
	private String name;
	private String planName;
	private LocalDate joinDate;

	public RecentCustomerResponse(Long id, String name, String planName, LocalDate joinDate) {
		this.id = id;
		this.name = name;
		this.planName = planName;
		this.joinDate = joinDate;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}

	public String getPlanName() {
		return planName;
	}

	public LocalDate getJoinDate() {
		return joinDate;
	}
}
