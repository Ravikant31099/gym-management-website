package com.fitzone.gymbackend.service;

import com.fitzone.gymbackend.constant.CustomerConstants;
import com.fitzone.gymbackend.dto.LeadRequest;
import com.fitzone.gymbackend.dto.LeadResponse;
import com.fitzone.gymbackend.entity.Lead;
import com.fitzone.gymbackend.exception.BusinessException;
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

	public LeadResponse saveLead(LeadRequest lead) {
		if (leadRepository.existsByPhone(lead.getPhone())) {
			throw new BusinessException("Lead already exists with this phone number.");
		}
		Lead saveLead = mapToEntity(lead);
		return leadMapToResponse(leadRepository.save(saveLead));
	}

	public List<LeadResponse> getAllLeads() {
		return leadRepository.findAll().stream().map(this::leadMapToResponse).toList();
	}

	public void deleteLead(Long id) {
		Lead lead = leadRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFound("Lead not found with id: " + id));
		leadRepository.delete(lead);
	}

	public LeadResponse updateStatus(Long id, String status) {
		Lead lead = leadRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFound("Lead not found with id: " + id));
		if (!CustomerConstants.ALLOWED_LEAD_STATUS.contains(status)) {
		    throw new IllegalArgumentException("Invalid Lead Status.");
		}
		lead.setStatus(status);
		return leadMapToResponse(leadRepository.save(lead));
	}
	
	public LeadResponse updateLead(Long id, LeadRequest request) {
	    Lead lead = leadRepository.findById(id)
	            .orElseThrow(() -> new ResourceNotFound("Lead not found."));
	    lead.setName(request.getName().trim());
	    lead.setEmail(request.getEmail().trim().toLowerCase());
	    lead.setPhone(request.getPhone().trim());
	    lead.setSubject(request.getSubject().trim());
	    lead.setMessage(request.getMessage().trim());
	    return leadMapToResponse(leadRepository.save(lead));
	}

	private Lead mapToEntity(LeadRequest request) {
		Lead lead = new Lead();
		lead.setName(request.getName().trim());
		lead.setEmail(request.getEmail().trim().toLowerCase());
		lead.setPhone(request.getPhone().trim());
		lead.setSubject(request.getSubject().trim());
		lead.setMessage(request.getMessage().trim());
		lead.setStatus("NEW");
		return lead;
	}

	private LeadResponse leadMapToResponse(Lead lead) {
		return new LeadResponse(lead.getId(), lead.getName(), lead.getEmail(), lead.getPhone(), lead.getSubject(),
				lead.getMessage(), lead.getStatus());
	}
}
