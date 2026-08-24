package com.fitzone.gymbackend.controller;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fitzone.gymbackend.entity.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
	List<AuditLog> findByModuleAndEntityIdOrderByCreatedAtDesc(String module, Long entityId);
}
