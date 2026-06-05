package com.fitzone.gymbackend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fitzone.gymbackend.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
	boolean existsByPlanId(Long planId);

	List<Customer> findByArchivedFalse();

	Optional<Customer> findByIdAndArchivedFalse(Long id);

	Long countByArchivedFalse();

	boolean existsByPhone(String phone);

	boolean existsByEmail(String email);

	boolean existsByPhoneAndIdNot(String phone, Long id);

	boolean existsByEmailAndIdNot(String email, Long id);
}
