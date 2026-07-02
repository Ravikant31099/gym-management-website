package com.fitzone.gymbackend.repository;

import com.fitzone.gymbackend.entity.Lead;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LeadRepository extends JpaRepository<Lead, Long> {
	List<Lead> findByActiveTrue();

	Optional<Lead> findByIdAndActiveTrue(Long id);

	boolean existsByPhoneAndActiveTrue(String phone);

	boolean existsByPhoneAndIdNotAndActiveTrue(String phone, Long id);

	@Query("""
			SELECT l
			FROM Lead l
			WHERE l.active = true
			AND (
			    :search IS NULL
			    OR LOWER(l.name) LIKE LOWER(CONCAT('%',:search,'%'))
			    OR LOWER(l.email) LIKE LOWER(CONCAT('%',:search,'%'))
			    OR l.phone LIKE CONCAT('%',:search,'%')
			)
			AND (
			    :status IS NULL
			    OR l.status = :status
			)
			ORDER BY l.createdAt DESC
			""")
	List<Lead> exportLeads(@Param("search") String search, @Param("status") String status);
}
