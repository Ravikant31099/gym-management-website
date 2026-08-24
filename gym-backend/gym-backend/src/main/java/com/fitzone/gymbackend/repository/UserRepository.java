package com.fitzone.gymbackend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fitzone.gymbackend.entity.User;
import com.fitzone.gymbackend.enums.UserRole;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmailIgnoreCase(String email);

	boolean existsByEmailIgnoreCase(String email);

	boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);

	List<User> findByActiveTrue();

	Optional<User> findByEmailIgnoreCaseAndActiveTrueAndDeletedFalse(
	        String email);

	@Query("""
			    SELECT u FROM User u
			    WHERE u.deleted = false
			    AND (
			        :search IS NULL
			        OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%'))
			        OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
			    )
			    AND (:role IS NULL OR u.role = :role)
			    AND (:active IS NULL OR u.active = :active)
			""")
	Page<User> findUsers(@Param("search") String search, @Param("role") UserRole role, @Param("active") Boolean active,
			Pageable pageable);
	
	Optional<User> findByIdAndDeletedFalse(Long id);
}
