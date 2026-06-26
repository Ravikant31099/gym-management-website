package com.fitzone.gymbackend.repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import com.fitzone.gymbackend.entity.Payment;
import com.fitzone.gymbackend.dto.PaymentModeResponse;
import com.fitzone.gymbackend.dto.RevenueByPlanResponse;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
	boolean existsByPlanId(Long planId);

	boolean existsByCustomerId(Long customerId);

	@Query("""
			SELECT COALESCE(SUM(p.amount),0)
			FROM Payment p
			WHERE p.paymentDate BETWEEN :startDate AND :endDate
			""")
	BigDecimal getRevenueThisMonth(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

	@Query("""
			SELECT p
			FROM Payment p
			WHERE
			(:search IS NULL OR
			 LOWER(p.customer.name) LIKE LOWER(CONCAT('%', :search, '%')))
			AND
			(:status IS NULL OR p.status = :status)
			AND
			(:mode IS NULL OR p.paymentMode = :mode)
			AND
			(:planId IS NULL OR p.plan.id = :planId)
			""")
	Page<Payment> searchPayments(@Param("search") String search, @Param("status") String status,
			@Param("mode") String mode, @Param("planId") Long planId, Pageable pageable);

	@Query("""
			SELECT COALESCE(SUM(p.amount),0)
			FROM Payment p
			WHERE p.status='PAID'
			""")
	BigDecimal getTotalRevenue();

	@Query("""
			SELECT COALESCE(SUM(p.amount),0)
			FROM Payment p
			WHERE p.status='PENDING'
			""")
	BigDecimal getPendingRevenue();

	@Query("""
			SELECT COALESCE(SUM(p.amount),0)
			FROM Payment p
			WHERE p.status='PAID'
			AND p.paymentDate=:today
			""")
	BigDecimal getTodayCollection(@Param("today") LocalDate today);

	@Query("""
			SELECT COUNT(p)
			FROM Payment p
			""")
	Long getTotalTransactions();

	@Query("""
			SELECT new com.fitzone.gymbackend.dto.RevenueByPlanResponse(
			    p.plan.name,
			    SUM(p.amount)
			)
			FROM Payment p
			WHERE p.status = 'PAID'
			GROUP BY p.plan.name
			ORDER BY SUM(p.amount) DESC
			""")
	List<RevenueByPlanResponse> getRevenueByPlan();

	@Query("""
			SELECT new com.fitzone.gymbackend.dto.RevenueByPlanResponse(
			        p.plan.name,
			        SUM(p.amount)
			)
			FROM Payment p
			WHERE p.status='PAID'
			GROUP BY p.plan.name
			ORDER BY SUM(p.amount) DESC
			""")
	List<RevenueByPlanResponse> getTopPlans();

	@Query("""
			SELECT new com.fitzone.gymbackend.dto.PaymentModeResponse(
			        p.paymentMode,
			        COUNT(p)
			)
			FROM Payment p
			GROUP BY p.paymentMode
			ORDER BY COUNT(p) DESC
			""")
	List<PaymentModeResponse> getPaymentModeDistribution();

	@Query("""
			    SELECT p
			    FROM Payment p
			    WHERE
			        (:search IS NULL OR
			            LOWER(p.customer.name) LIKE LOWER(CONCAT('%', :search, '%')))
			    AND
			        (:status IS NULL OR p.status = :status)
			    AND
			        (:mode IS NULL OR p.paymentMode = :mode)
			    AND
			        (:planId IS NULL OR p.plan.id = :planId)
			    ORDER BY p.paymentDate DESC
			""")
	List<Payment> exportPayments(@Param("search") String search, @Param("status") String status,
			@Param("mode") String mode, @Param("planId") Long planId);
}
