package com.fitzone.gymbackend.repository;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fitzone.gymbackend.entity.Customer;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
	boolean existsByPlanId(Long planId);

	Page<Customer> findByArchivedFalse(Pageable pageable);

	Optional<Customer> findByIdAndArchivedFalse(Long id);

	Long countByArchivedFalse();

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

}
