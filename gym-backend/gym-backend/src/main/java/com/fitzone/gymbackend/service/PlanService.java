package com.fitzone.gymbackend.service;

import com.fitzone.gymbackend.dto.PlanRequest;
import com.fitzone.gymbackend.dto.PlanResponse;
import com.fitzone.gymbackend.entity.Plan;
import com.fitzone.gymbackend.repository.PlanRespository;
import org.springframework.stereotype.Service;
import java.util.List;
import com.fitzone.gymbackend.exception.ResourceNotFound;

@Service
public class PlanService {
	private final PlanRespository pr;

	public PlanService(PlanRespository pr) {
		this.pr = pr;
	}

	public List<PlanResponse> getAllPlans() {
		return pr.findAll().stream().map(this::planMapToResponse).toList();
	}

	public PlanResponse createPlan(PlanRequest p) {
		Plan pl = new Plan();
		pl.setName(p.getName());
		pl.setDescription(p.getDescription());
		pl.setPeriod(p.getPeriod());
		pl.setPrice(p.getPrice());
		pl.setPopular(p.getPopular());
		Plan sp = pr.save(pl);
		return planMapToResponse(sp);
	}

	public PlanResponse updatExistingPlan(Long id, Plan p) {
		Plan ep = pr.findById(id).orElseThrow(() -> new ResourceNotFound("Plan Not Found"));
		ep.setName(p.getName());
		ep.setDescription(p.getDescription());
		ep.setPrice(p.getPrice());
		ep.setPeriod(p.getPeriod());
		ep.setPopular(p.getPopular());
		Plan up = pr.save(ep);
		return planMapToResponse(up);
	}

	public void deletePlan(Long id) {
		Plan ep = pr.findById(id).orElseThrow(() -> new ResourceNotFound("Plan Not Found"));
		pr.delete(ep);
	}

	private PlanResponse planMapToResponse(Plan plan) {
		return new PlanResponse(plan.getId(), plan.getName(), plan.getDescription(), plan.getPrice(), plan.getPeriod(),
				plan.getPopular());
	}
}
