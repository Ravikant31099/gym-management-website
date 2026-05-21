package com.fitzone.gymbackend.repository;

import com.fitzone.gymbackend.entity.Plan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanRespository extends JpaRepository<Plan, Long> {

}
