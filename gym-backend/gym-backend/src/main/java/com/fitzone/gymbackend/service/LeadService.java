package com.fitzone.gymbackend.service;

import com.fitzone.gymbackend.entity.Lead;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.repository.LeadRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadService {

	private final LeadRepository leadRepository;

	public LeadService(LeadRepository leadRepository) {
		this.leadRepository = leadRepository;
	}

	public Lead saveLead(Lead lead) {
		return leadRepository.save(lead);
	}

	public List<Lead> getAllLeads() {
		return leadRepository.findAll();
	}

	public void deleteLead(Long id) {
		Lead lead = leadRepository.findById(id).orElseThrow(() -> new ResourceNotFound("Lead not found with id: " + id));
		leadRepository.delete(lead);
	}

	public Lead updateStatus(Long id, String status) {
		Lead lead = leadRepository.findById(id).orElseThrow(() -> new ResourceNotFound("Lead not found with id: " + id));
		lead.setStatus(status);
		return leadRepository.save(lead);
	}
}
