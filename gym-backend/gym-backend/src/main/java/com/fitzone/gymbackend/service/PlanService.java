package com.fitzone.gymbackend.service;

import com.fitzone.gymbackend.dto.PlanRequest;
import com.fitzone.gymbackend.dto.PlanResponse;
import com.fitzone.gymbackend.entity.Plan;
import com.fitzone.gymbackend.exception.BusinessException;
import com.fitzone.gymbackend.exception.ResourceInUseException;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.repository.CustomerRepository;
import com.fitzone.gymbackend.repository.PaymentRepository;
import com.fitzone.gymbackend.repository.PlanRepository;
import org.springframework.stereotype.Service;
import com.fitzone.gymbackend.constant.CustomerConstants;
import java.math.BigDecimal;
import java.util.List;

@Service
public class PlanService {

	private final PlanRepository planRepository;
	private final CustomerRepository customerRepository;
	private final PaymentRepository paymentRepository;

	public PlanService(PlanRepository planRepository, CustomerRepository customerRepository,
			PaymentRepository paymentRepository) {
		this.planRepository = planRepository;
		this.customerRepository = customerRepository;
		this.paymentRepository = paymentRepository;
	}

	public List<PlanResponse> getAllPlans() {
		return planRepository.findByActiveTrue().stream().map(this::planMapToResponse).toList();
	}

	public PlanResponse createPlan(PlanRequest p) {
		if (planRepository.existsByNameIgnoreCase(p.getName())) {
			throw new BusinessException("Plan name already exists");
		}
		if (p.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
			throw new BusinessException("Plan amount must be greater than zero.");
		}
		if (!CustomerConstants.ALLOWED_PLAN_PERIOD.contains(p.getPeriod())) {
			throw new IllegalArgumentException("Invalid Plan Period.");
		}
		Plan plan = new Plan();
		plan.setName(p.getName().trim());
		plan.setDescription(p.getDescription().trim());
		plan.setPeriod(p.getPeriod());
		plan.setPrice(p.getPrice());
		plan.setPopular(p.getPopular());
		return planMapToResponse(planRepository.save(plan));
	}

	public PlanResponse updateExistingPlan(Long id, PlanRequest p) {
		Plan existing = planRepository.findById(id).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		if (planRepository.existsByNameIgnoreCaseAndIdNot(p.getName(), id)) {
			throw new BusinessException("Plan name already exists");
		}
		if (p.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
			throw new BusinessException("Plan amount must be greater than zero.");
		}
		if (!CustomerConstants.ALLOWED_PLAN_PERIOD.contains(p.getPeriod())) {
			throw new IllegalArgumentException("Invalid Plan Period.");
		}
		existing.setName(p.getName().trim());
		existing.setDescription(p.getDescription().trim());
		existing.setPrice(p.getPrice());
		existing.setPeriod(p.getPeriod());
		existing.setPopular(p.getPopular());
		return planMapToResponse(planRepository.save(existing));
	}

	public void deactivatePlan(Long id) {
		if (customerRepository.existsByPlanId(id)) {
			throw new ResourceInUseException("Plan is assigned to customers and cannot be deleted.");
		}
		if (paymentRepository.existsByPlanId(id)) {
			throw new ResourceInUseException("Plan has payment records and cannot be deleted.");
		}
		Plan plan = planRepository.findById(id).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		plan.setActive(false);
		planRepository.save(plan);
	}

	private PlanResponse planMapToResponse(Plan plan) {
		return new PlanResponse(plan.getId(), plan.getName(), plan.getDescription(), plan.getPrice(), plan.getPeriod(),
				plan.getPopular());
	}

	public List<PlanResponse> exportPlans() {
		return planRepository.findByActiveTrue().stream().map(this::planMapToResponse).toList();
	}
}
