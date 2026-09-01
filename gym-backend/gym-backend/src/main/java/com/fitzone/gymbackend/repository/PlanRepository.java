package com.fitzone.gymbackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fitzone.gymbackend.entity.Plan;

public interface PlanRepository extends JpaRepository<Plan, Long> {

	List<Plan> findByActiveTrue();

	Optional<Plan> findByIdAndActiveTrue(Long id);

	boolean existsByNameIgnoreCase(String name);

	boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}