package com.fitzone.gymbackend.repository;

import com.fitzone.gymbackend.entity.Plan;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlanRepository extends JpaRepository<Plan, Long> {
	List<Plan> findByActiveTrue();
	Optional<Plan> findByIdAndActiveTrue(Long id);
}
