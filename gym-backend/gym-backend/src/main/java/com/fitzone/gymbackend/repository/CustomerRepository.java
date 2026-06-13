package com.fitzone.gymbackend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.fitzone.gymbackend.dto.PlanDistributionResponse;
import com.fitzone.gymbackend.dto.RecentCustomerResponse;
import com.fitzone.gymbackend.entity.Customer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
	boolean existsByPlanId(Long planId);

	Page<Customer> findByArchivedFalse(Pageable pageable);

	List<Customer> findByArchivedFalse();

	Optional<Customer> findByIdAndArchivedFalse(Long id);

	Long countByArchivedFalse();

	Long countByStatusAndArchivedFalse(String status);

	boolean existsByPhone(String phone);

	boolean existsByEmail(String email);

	boolean existsByPhoneAndIdNot(String phone, Long id);

	boolean existsByEmailAndIdNot(String email, Long id);

	@Query("""
			    SELECT c
			    FROM Customer c
			    WHERE c.archived = false
			    AND (
			        :search IS NULL
			        OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))
			        OR c.phone LIKE CONCAT('%', :search, '%')
			        OR LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))
			    )
			    AND (
			        :status IS NULL
			        OR c.status = :status
			    )
			    AND (
			        :planId IS NULL
			        OR c.plan.id = :planId
			    )
			""")
	Page<Customer> searchCustomers(@Param("search") String search, @Param("status") String status,
			@Param("planId") Long planId, Pageable pageable);

	@Query("""
			    SELECT COUNT(c)
			    FROM Customer c
			    WHERE c.archived = false
			    AND c.status = 'ACTIVE'
			    AND c.expiryDate BETWEEN :today AND :expiryLimit
			""")
	Long countExpiringCustomers(@Param("today") LocalDate today, @Param("expiryLimit") LocalDate expiryLimit);

	@Query("""
			    SELECT new com.fitzone.gymbackend.dto.PlanDistributionResponse(
			        p.name,
			        COUNT(c)
			    )
			    FROM Customer c
			    JOIN c.plan p
			    WHERE c.archived = false
			    GROUP BY p.name
			""")
	List<PlanDistributionResponse> getPlanDistribution();

	@Query("""
			    SELECT p.name
			    FROM Customer c
			    JOIN c.plan p
			    WHERE c.archived = false
			    GROUP BY p.name
			    ORDER BY COUNT(c) DESC
			""")
	List<String> findMostPopularPlan();

	@Query("""
			    SELECT new com.fitzone.gymbackend.dto.RecentCustomerResponse(
			        c.id,
			        c.name,
			        p.name,
			        c.joinDate
			    )
			    FROM Customer c
			    JOIN c.plan p
			    WHERE c.archived = false
			    ORDER BY c.joinDate DESC
			""")
	Page<RecentCustomerResponse> getRecentCustomers(Pageable pageable);

	@Query("""
			    SELECT c
			    FROM Customer c
			    WHERE c.archived = false
			    AND c.status = 'ACTIVE'
			    AND c.expiryDate BETWEEN :today AND :expiryLimit
			    AND (
			        :search IS NULL
			        OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))
			        OR c.phone LIKE CONCAT('%', :search, '%')
			        OR LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))
			    )
			    AND (
			        :planId IS NULL
			        OR c.plan.id = :planId
			    )
			""")
	Page<Customer> findExpiringCustomers(@Param("search") String search, @Param("planId") Long planId,
			@Param("today") LocalDate today, @Param("expiryLimit") LocalDate expiryLimit, Pageable pageable);

	@Query("""
			    SELECT c
			    FROM Customer c
			    WHERE c.archived = false
			    AND c.expiryDate < :today
			    AND (
			        :search IS NULL
			        OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))
			        OR c.phone LIKE CONCAT('%', :search, '%')
			        OR LOWER(c.email) LIKE LOWER(CONCAT('%', :search, '%'))
			    )
			    AND (
			        :planId IS NULL
			        OR c.plan.id = :planId
			    )
			""")
	Page<Customer> findExpiredCustomers(@Param("search") String search, @Param("planId") Long planId,
			@Param("today") LocalDate today, Pageable pageable);
}
