package com.fitzone.gymbackend.controller;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fitzone.gymbackend.entity.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

}
