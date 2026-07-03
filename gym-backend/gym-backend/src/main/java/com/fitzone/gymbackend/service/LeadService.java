package com.fitzone.gymbackend.service;

import com.fitzone.gymbackend.constant.CustomerConstants;
import com.fitzone.gymbackend.dto.LeadAnalyticsResponse;
import com.fitzone.gymbackend.dto.LeadRequest;
import com.fitzone.gymbackend.dto.LeadResponse;
import com.fitzone.gymbackend.entity.Lead;
import com.fitzone.gymbackend.enums.ActivityType;
import com.fitzone.gymbackend.exception.BusinessException;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.repository.LeadRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeadService {

	private final LeadRepository leadRepository;
	private final AuditLogService auditLogService;

	public LeadService(LeadRepository leadRepository, AuditLogService auditLogService) {
		this.leadRepository = leadRepository;
		this.auditLogService = auditLogService;
	}

	public LeadResponse saveLead(LeadRequest lead) {
		if (leadRepository.existsByPhoneAndActiveTrue(lead.getPhone())) {
			throw new BusinessException("Lead already exists with this phone number.");
		}
		Lead saveLead = mapToEntity(lead);
		auditLogService.logActivity("LEAD", saveLead.getId(), ActivityType.LEAD_CREATED,
				"Lead Created for :- " + lead.getName());
		return leadMapToResponse(leadRepository.save(saveLead));
	}

	public Page<LeadResponse> getAllLeads(String search, String status, Pageable pageable, String sortBy,
			String sortDir) {
		Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
		Page<Lead> leads = leadRepository.searchLeads(emptyToNull(search), emptyToNull(status), sortedPageable);
		return leads.map(this::leadMapToResponse);
	}

	public void deleteLead(Long id) {
		Lead lead = leadRepository.findByIdAndActiveTrue(id)
				.orElseThrow(() -> new ResourceNotFound("Lead not found with id: " + id));
		lead.setActive(false);
		auditLogService.logActivity("LEAD", lead.getId(), ActivityType.LEAD_DELETED,
				"Lead deactivated for : " + lead.getName());
		leadRepository.save(lead);
	}

	public LeadResponse updateStatus(Long id, String status) {
		Lead lead = leadRepository.findByIdAndActiveTrue(id)
				.orElseThrow(() -> new ResourceNotFound("Lead not found with id: " + id));
		if (!CustomerConstants.ALLOWED_LEAD_STATUS.contains(status)) {
			throw new IllegalArgumentException("Invalid Lead Status.");
		}
		lead.setStatus(status);
		Lead updatedStatusLead = leadRepository.save(lead);
		auditLogService.logActivity("LEAD", lead.getId(), ActivityType.LEAD_STATUS_UPDATED,
				"Status updated for Lead created by :- " + lead.getName());
		return leadMapToResponse(updatedStatusLead);
	}

	public LeadResponse updateLead(Long id, LeadRequest request) {
		Lead lead = leadRepository.findByIdAndActiveTrue(id).orElseThrow(() -> new ResourceNotFound("Lead not found."));
		lead.setName(request.getName().trim());
		lead.setEmail(request.getEmail().trim().toLowerCase());
		lead.setPhone(request.getPhone().trim());
		lead.setSubject(request.getSubject().trim());
		lead.setMessage(request.getMessage().trim());
		Lead updatedLead = leadRepository.save(lead);
		auditLogService.logActivity("LEAD", lead.getId(), ActivityType.LEAD_STATUS_UPDATED,
				"Lead updated for Lead created by :- " + lead.getName());
		return leadMapToResponse(updatedLead);
	}

	public List<LeadResponse> exportLeads(String search, String status) {
		return leadRepository.exportLeads(emptyToNull(search), emptyToNull(status)).stream()
				.map(this::leadMapToResponse).toList();
	}

	public LeadAnalyticsResponse getLeadAnalytics() {
		return new LeadAnalyticsResponse(leadRepository.countByActiveTrue(),
				leadRepository.countByActiveTrueAndStatus("NEW"),
				leadRepository.countByActiveTrueAndStatus("CONTACTED"),
				leadRepository.countByActiveTrueAndStatus("FOLLOWUP"),
				leadRepository.countByActiveTrueAndStatus("JOINED"),
				leadRepository.countByActiveTrueAndStatus("NOTINTERESTED"));
	}

	private String emptyToNull(String value) {
		return value == null || value.isBlank() ? null : value;
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
