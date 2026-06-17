package com.fitzone.gymbackend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.fitzone.gymbackend.entity.CustomerActivityLog;

@Repository
public interface CustomerActivityLogRepository extends JpaRepository<CustomerActivityLog, Long> {
	List<CustomerActivityLog> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
}
