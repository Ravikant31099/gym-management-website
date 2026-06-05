package com.fitzone.gymbackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fitzone.gymbackend.entity.Payment;

public interface PaymentRespository extends JpaRepository<Payment, Long> {
	boolean existsByPlanId(Long planId);
	boolean existsByCustomerId(Long customerId);
}
