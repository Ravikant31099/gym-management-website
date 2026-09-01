package com.fitzone.gymbackend.service;

import java.util.List;
import java.util.Locale;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.fitzone.gymbackend.constant.CustomerConstants;
import com.fitzone.gymbackend.dto.LeadAnalyticsResponse;
import com.fitzone.gymbackend.dto.LeadRequest;
import com.fitzone.gymbackend.dto.LeadResponse;
import com.fitzone.gymbackend.entity.Lead;
import com.fitzone.gymbackend.enums.ActivityType;
import com.fitzone.gymbackend.exception.BusinessException;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.repository.LeadRepository;
import com.fitzone.gymbackend.security.LeadRateLimiter;

import jakarta.transaction.Transactional;

import java.util.Set;

@Service
public class LeadService {

	private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("createdAt", "name", "status", "email");

	private final LeadRepository leadRepository;
	private final AuditLogService auditLogService;
	private final LeadRateLimiter leadRateLimiter;

	public LeadService(LeadRepository leadRepository, AuditLogService auditLogService,
			LeadRateLimiter leadRateLimiter) {
		this.leadRepository = leadRepository;
		this.auditLogService = auditLogService;
		this.leadRateLimiter = leadRateLimiter;
	}

	@Transactional
	public LeadResponse saveLead(LeadRequest lead, String clientIp) {
		if (!leadRateLimiter.tryAcquire(clientIp)) {
			throw new BusinessException("Too many submissions from this address. Please try again later.");
		}
		if (leadRepository.existsByPhoneAndActiveTrue(lead.getPhone())) {
			throw new BusinessException("Lead already exists with this phone number.");
		}
		Lead newLead = mapToEntity(lead);
		Lead savedLead = leadRepository.save(newLead);
		auditLogService.logActivity("LEAD", savedLead.getId(), ActivityType.LEAD_CREATED,
				"Lead created for: " + savedLead.getName());
		return leadMapToResponse(savedLead);
	}

	public Page<LeadResponse> getAllLeads(String search, String status, Pageable pageable, String sortBy,
			String sortDir) {
		String safeSortBy = ALLOWED_SORT_FIELDS.contains(sortBy) ? sortBy : "createdAt";
		Sort sort = "asc".equalsIgnoreCase(sortDir) ? Sort.by(safeSortBy).ascending()
				: Sort.by(safeSortBy).descending();
		int safeSize = pageable.getPageSize() <= 0 ? 10 : Math.min(pageable.getPageSize(), 100);
		Pageable sortedPageable = PageRequest.of(Math.max(pageable.getPageNumber(), 0), safeSize, sort);
		Page<Lead> leads = leadRepository.searchLeads(emptyToNull(search), emptyToNull(status), sortedPageable);
		return leads.map(this::leadMapToResponse);
	}

	@Transactional
	public void deleteLead(Long id) {
		Lead lead = leadRepository.findByIdAndActiveTrue(id)
				.orElseThrow(() -> new ResourceNotFound("Lead not found with id: " + id));
		lead.setActive(false);
		leadRepository.save(lead);
		auditLogService.logActivity("LEAD", lead.getId(), ActivityType.LEAD_DELETED,
				"Lead deactivated for: " + lead.getName());
	}

	@Transactional
	public LeadResponse updateStatus(Long id, String status) {
		Lead lead = leadRepository.findByIdAndActiveTrue(id)
				.orElseThrow(() -> new ResourceNotFound("Lead not found with id: " + id));
		if (status == null || !CustomerConstants.ALLOWED_LEAD_STATUS.contains(status.toUpperCase(Locale.ROOT))) {
			throw new BusinessException("Invalid lead status.");
		}
		lead.setStatus(status.toUpperCase(Locale.ROOT));
		Lead updatedStatusLead = leadRepository.save(lead);
		auditLogService.logActivity("LEAD", lead.getId(), ActivityType.LEAD_STATUS_UPDATED,
				"Status updated for lead: " + lead.getName());
		return leadMapToResponse(updatedStatusLead);
	}

	@Transactional
	public LeadResponse updateLead(Long id, LeadRequest request) {
		Lead lead = leadRepository.findByIdAndActiveTrue(id).orElseThrow(() -> new ResourceNotFound("Lead not found."));
		String normalizedPhone = request.getPhone().trim();
		if (leadRepository.existsByPhoneAndIdNotAndActiveTrue(normalizedPhone, id)) {
			throw new BusinessException("Another lead already exists with this phone number.");
		}
		lead.setName(request.getName().trim());
		lead.setEmail(request.getEmail().trim().toLowerCase(Locale.ROOT));
		lead.setPhone(normalizedPhone);
		lead.setSubject(request.getSubject().trim());
		lead.setMessage(request.getMessage().trim());
		Lead updatedLead = leadRepository.save(lead);
		auditLogService.logActivity("LEAD", lead.getId(), ActivityType.LEAD_STATUS_UPDATED,
				"Lead details updated for: " + lead.getName());
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
				leadRepository.countByActiveTrueAndStatus("FOLLOW-UP"),
				leadRepository.countByActiveTrueAndStatus("JOINED"),
				leadRepository.countByActiveTrueAndStatus("NOT-INTERESTED"));
	}

	private String emptyToNull(String value) {
		return value == null || value.isBlank() ? null : value;
	}

	private Lead mapToEntity(LeadRequest request) {
		Lead lead = new Lead();
		lead.setName(request.getName().trim());
		lead.setEmail(request.getEmail().trim().toLowerCase(Locale.ROOT));
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