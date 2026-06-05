package com.fitzone.gymbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fitzone.gymbackend.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long>{
	boolean existsByPlanId(Long planId);
}
