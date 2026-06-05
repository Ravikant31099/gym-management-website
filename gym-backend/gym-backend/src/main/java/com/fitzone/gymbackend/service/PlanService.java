package com.fitzone.gymbackend.service;

import com.fitzone.gymbackend.dto.PlanRequest;
import com.fitzone.gymbackend.dto.PlanResponse;
import com.fitzone.gymbackend.entity.Plan;
import com.fitzone.gymbackend.exception.ResourceInUseException;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.repository.CustomerRepository;
import com.fitzone.gymbackend.repository.PaymentRepository;
import com.fitzone.gymbackend.repository.PlanRepository;
import org.springframework.stereotype.Service;
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
		Plan plan = new Plan();
		plan.setName(p.getName());
		plan.setDescription(p.getDescription());
		plan.setPeriod(p.getPeriod());
		plan.setPrice(p.getPrice());
		plan.setPopular(p.getPopular());
		return planMapToResponse(planRepository.save(plan));
	}

	public PlanResponse updateExistingPlan(Long id, PlanRequest p) {
		Plan existing = planRepository.findById(id).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		existing.setName(p.getName());
		existing.setDescription(p.getDescription());
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
}
