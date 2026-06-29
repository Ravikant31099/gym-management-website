package com.fitzone.gymbackend.repository;

import com.fitzone.gymbackend.entity.Lead;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeadRepository extends JpaRepository <Lead, Long>{
	boolean existsByPhone(String phone);
	boolean existsByPhoneAndIdNot(String phone, Long id);
}
