package com.fitzone.gymbackend.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.fitzone.gymbackend.controller.AuditLogRepository;
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

}
