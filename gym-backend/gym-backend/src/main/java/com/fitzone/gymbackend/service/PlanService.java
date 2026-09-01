package com.fitzone.gymbackend.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;

import com.fitzone.gymbackend.constant.CustomerConstants;
import com.fitzone.gymbackend.dto.PlanRequest;
import com.fitzone.gymbackend.dto.PlanResponse;
import com.fitzone.gymbackend.entity.Plan;
import com.fitzone.gymbackend.enums.ActivityType;
import com.fitzone.gymbackend.exception.BusinessException;
import com.fitzone.gymbackend.exception.ResourceInUseException;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.repository.CustomerRepository;
import com.fitzone.gymbackend.repository.PaymentRepository;
import com.fitzone.gymbackend.repository.PlanRepository;

import jakarta.transaction.Transactional;

@Service
public class PlanService {

	private final PlanRepository planRepository;
	private final CustomerRepository customerRepository;
	private final PaymentRepository paymentRepository;
	private final AuditLogService auditLogService;

	public PlanService(PlanRepository planRepository, CustomerRepository customerRepository,
			PaymentRepository paymentRepository, AuditLogService auditLogService) {
		this.planRepository = planRepository;
		this.customerRepository = customerRepository;
		this.paymentRepository = paymentRepository;
		this.auditLogService = auditLogService;
	}

	public List<PlanResponse> getAllPlans() {
		return planRepository.findByActiveTrue().stream().map(this::planMapToResponse).toList();
	}

	@Transactional
	public PlanResponse createPlan(PlanRequest p) {
		String normalizedName = p.getName().trim();
		if (planRepository.existsByNameIgnoreCase(normalizedName)) {
			throw new BusinessException("Plan name already exists");
		}
		validatePriceAndPeriod(p.getPrice(), p.getPeriod());
		Plan plan = new Plan();
		plan.setName(normalizedName);
		plan.setDescription(p.getDescription().trim());
		plan.setPeriod(p.getPeriod());
		plan.setPrice(p.getPrice());
		plan.setPopular(p.getPopular());
		Plan savedPlan = planRepository.save(plan);
		auditLogService.logActivity("PLAN", savedPlan.getId(), ActivityType.PLAN_CREATED,
				"Plan '" + savedPlan.getName() + "' created.");
		return planMapToResponse(savedPlan);
	}

	@Transactional
	public PlanResponse updateExistingPlan(Long id, PlanRequest p) {
		Plan existing = planRepository.findById(id).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		String normalizedName = p.getName().trim();
		if (planRepository.existsByNameIgnoreCaseAndIdNot(normalizedName, id)) {
			throw new BusinessException("Plan name already exists");
		}
		validatePriceAndPeriod(p.getPrice(), p.getPeriod());
		existing.setName(normalizedName);
		existing.setDescription(p.getDescription().trim());
		existing.setPrice(p.getPrice());
		existing.setPeriod(p.getPeriod());
		existing.setPopular(p.getPopular());
		Plan updatedPlan = planRepository.save(existing);
		auditLogService.logActivity("PLAN", updatedPlan.getId(), ActivityType.PLAN_UPDATED,
				"Plan '" + updatedPlan.getName() + "' updated.");
		return planMapToResponse(updatedPlan);
	}

	@Transactional
	public void deactivatePlan(Long id) {
		Plan plan = planRepository.findById(id).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		if (!Boolean.TRUE.equals(plan.getActive())) {
			return; // already inactive — idempotent
		}
		if (customerRepository.existsByPlanId(id)) {
			throw new ResourceInUseException("Plan is assigned to customers and cannot be deleted.");
		}
		if (paymentRepository.existsByPlanId(id)) {
			throw new ResourceInUseException("Plan has payment records and cannot be deleted.");
		}
		plan.setActive(false);
		planRepository.save(plan);
		auditLogService.logActivity("PLAN", plan.getId(), ActivityType.PLAN_DEACTIVATED,
				"Plan '" + plan.getName() + "' deactivated.");
	}

	public List<PlanResponse> exportPlans() {
		return planRepository.findByActiveTrue().stream().map(this::planMapToResponse).toList();
	}

	private void validatePriceAndPeriod(BigDecimal price, Integer period) {
		if (price.compareTo(BigDecimal.ZERO) <= 0) {
			throw new BusinessException("Plan amount must be greater than zero.");
		}
		if (period == null || !CustomerConstants.ALLOWED_PLAN_PERIOD.contains(period)) {
			throw new BusinessException("Invalid plan period. Allowed values: " + CustomerConstants.ALLOWED_PLAN_PERIOD
					.stream().map(String::valueOf).reduce((a, b) -> a + ", " + b).orElse(""));
		}
	}

	private PlanResponse planMapToResponse(Plan plan) {
		return new PlanResponse(plan.getId(), plan.getName(), plan.getDescription(), plan.getPrice(), plan.getPeriod(),
				plan.getPopular());
	}
}