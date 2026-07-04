package com.fitzone.gymbackend.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.fitzone.gymbackend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
	Optional<User> findByEmailIgnoreCase(String email);
	boolean existsByEmailIgnoreCase(String email);
	boolean existsByEmailIgnoreCaseAndIdNot(String email, Long id);
	List<User> findByActiveTrue();
	Optional<User> findByEmailIgnoreCaseAndActiveTrue(String email);
}
