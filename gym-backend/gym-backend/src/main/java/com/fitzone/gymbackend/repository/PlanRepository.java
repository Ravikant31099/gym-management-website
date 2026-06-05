package com.fitzone.gymbackend.repository;

import com.fitzone.gymbackend.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanRepository extends JpaRepository<Plan, Long> {
}
