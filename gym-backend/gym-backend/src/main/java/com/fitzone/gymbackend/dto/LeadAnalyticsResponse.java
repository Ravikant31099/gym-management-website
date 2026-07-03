package com.fitzone.gymbackend.dto;

public class LeadAnalyticsResponse {
	private long totalLeads;
	private long newLeads;
	private long contactedLeads;
	private long followUpLeads;
	private long joinedLeads;
	private long notInterestedLeads;

	public long getTotalLeads() {
		return totalLeads;
	}

	public void setTotalLeads(long totalLeads) {
		this.totalLeads = totalLeads;
	}

	public long getNewLeads() {
		return newLeads;
	}

	public void setNewLeads(long newLeads) {
		this.newLeads = newLeads;
	}

	public long getContactedLeads() {
		return contactedLeads;
	}

	public void setContactedLeads(long contactedLeads) {
		this.contactedLeads = contactedLeads;
	}

	public long getFollowUpLeads() {
		return followUpLeads;
	}

	public void setFollowUpLeads(long followUpLeads) {
		this.followUpLeads = followUpLeads;
	}

	public long getJoinedLeads() {
		return joinedLeads;
	}

	public void setJoinedLeads(long joinedLeads) {
		this.joinedLeads = joinedLeads;
	}

	public long getNotInterestedLeads() {
		return notInterestedLeads;
	}

	public void setNotInterestedLeads(long notInterestedLeads) {
		this.notInterestedLeads = notInterestedLeads;
	}

	public LeadAnalyticsResponse(long totalLeads, long newLeads, long contactedLeads, long followUpLeads,
			long joinedLeads, long notInterestedLeads) {
		super();
		this.totalLeads = totalLeads;
		this.newLeads = newLeads;
		this.contactedLeads = contactedLeads;
		this.followUpLeads = followUpLeads;
		this.joinedLeads = joinedLeads;
		this.notInterestedLeads = notInterestedLeads;
	}

	public LeadAnalyticsResponse() {
		super();
	}

}
