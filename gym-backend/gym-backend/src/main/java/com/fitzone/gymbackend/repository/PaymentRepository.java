package com.fitzone.gymbackend.repository;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fitzone.gymbackend.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
	boolean existsByPlanId(Long planId);

	boolean existsByCustomerId(Long customerId);

	@Query("""
			SELECT COALESCE(SUM(p.amount),0)
			FROM Payment p
			WHERE p.paymentDate BETWEEN :startDate AND :endDate
			""")
	BigDecimal getRevenueThisMonth(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
