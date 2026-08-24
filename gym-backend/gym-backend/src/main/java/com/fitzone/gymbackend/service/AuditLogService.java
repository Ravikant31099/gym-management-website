package com.fitzone.gymbackend.service;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.fitzone.gymbackend.controller.AuditLogRepository;
import com.fitzone.gymbackend.dto.UserActivityResponse;
import com.fitzone.gymbackend.entity.AuditLog;
import com.fitzone.gymbackend.enums.ActivityType;

@Service
public class AuditLogService {
	private AuditLogRepository auditLogRepository;

	public AuditLogService(AuditLogRepository auditLogRepository) {
		this.auditLogRepository = auditLogRepository;
	}

	public void logActivity(String module, Long entityId, ActivityType activityType, String description) {
		AuditLog log = new AuditLog();
		log.setModule(module);
		log.setEntityId(entityId);
		log.setActivityType(activityType);
		log.setDescription(description);
		log.setPerformedBy(getCurrentUser());
		auditLogRepository.save(log);
	}

	private String getCurrentUser() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null) {
			return "SYSTEM";
		}
		String email = auth.getName();
		String role = auth.getAuthorities().stream().findFirst().map(a -> a.getAuthority().replace("ROLE_", ""))
				.orElse("UNKNOWN");
		return role + "-" + email;
	}

	public List<UserActivityResponse> getUserActivities(Long userId) {
		return auditLogRepository.findByModuleAndEntityIdOrderByCreatedAtDesc("USER", userId).stream()
				.map(log -> new UserActivityResponse(log.getId(), log.getActivityType(), log.getDescription(),
						log.getPerformedBy(), log.getCreatedAt()))
				.toList();
	}

}
