package com.fitzone.gymbackend.dto;

import java.time.LocalDateTime;

import com.fitzone.gymbackend.enums.ActivityType;

public class UserActivityResponse {

    private Long id;
    private ActivityType activityType;
    private String description;
    private String performedBy;
    private LocalDateTime createdAt;

    public UserActivityResponse() {
        super();
    }

    public UserActivityResponse(
            Long id,
            ActivityType activityType,
            String description,
            String performedBy,
            LocalDateTime createdAt) {

        this.id = id;
        this.activityType = activityType;
        this.description = description;
        this.performedBy = performedBy;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ActivityType getActivityType() {
        return activityType;
    }

    public void setActivityType(ActivityType activityType) {
        this.activityType = activityType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPerformedBy() {
        return performedBy;
    }

    public void setPerformedBy(String performedBy) {
        this.performedBy = performedBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}