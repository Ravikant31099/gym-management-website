package com.fitzone.gymbackend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fitzone.gymbackend.exception.ResourceInUseException;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.entity.Plan;
import com.fitzone.gymbackend.repository.PlanRespository;
import com.fitzone.gymbackend.dto.CustomerRequest;
import com.fitzone.gymbackend.dto.CustomerResponse;
import com.fitzone.gymbackend.entity.Customer;
import com.fitzone.gymbackend.repository.CustomerRepository;
import com.fitzone.gymbackend.repository.PaymentRespository;

@Service
public class CustomerService {

	@Autowired
	private CustomerRepository cr;

	@Autowired
	private PlanRespository pr;
	
	@Autowired
	private PaymentRespository par;

	public List<CustomerResponse> getAllCustomer() {
		return cr.findAll().stream().map(this::customerMapToResponse).toList();
	}

	public CustomerResponse saveCustomer(CustomerRequest c) {
		Plan plan = pr.findById(c.getPlanId()).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		Customer cs = new Customer();
		cs.setName(c.getName());
		cs.setEmail(c.getEmail());
		cs.setPhone(c.getPhone());
		cs.setJoinDate(c.getJoinDate());
		cs.setExpiryDate(c.getExpiryDate());
		cs.setStatus(c.getStatus());
		cs.setPlan(plan);
		Customer sC = cr.save(cs);
		return customerMapToResponse(sC);
	}

	public CustomerResponse updateCustomer(Long id, CustomerRequest c) {
		Customer cs = cr.findById(id).orElseThrow(() -> new ResourceNotFound("Customer not found"));
		Plan plan = pr.findById(c.getPlanId()).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		cs.setName(c.getName());
		cs.setEmail(c.getEmail());
		cs.setPhone(c.getPhone());
		cs.setJoinDate(c.getJoinDate());
		cs.setExpiryDate(c.getExpiryDate());
		cs.setStatus(c.getStatus());
		cs.setPlan(plan);
		Customer sC = cr.save(cs);
		return customerMapToResponse(sC);
	}

	public void deleteCustomer(Long id) {
		if(par.existsByCustomerId(id)) {
			throw new ResourceInUseException("Customer has payment records and cannot be deleted.");
		}
		Customer cs = cr.findById(id).orElseThrow(() -> new ResourceNotFound("Customer not found"));
		cr.delete(cs);
	}

	private CustomerResponse customerMapToResponse(Customer c) {
		return new CustomerResponse(c.getId(), c.getName(), c.getEmail(), c.getPhone(), c.getJoinDate(),
				c.getExpiryDate(), c.getStatus(), c.getPlan().getId(), c.getPlan().getName(), c.getPlan().getPrice());
	}

	private int getPlanMonth(String period) {
		period = period.toLowerCase().trim().replace("/", "");
		switch (period) {
		case "month":
			return 1;
		case "3 month":
			return 3;
		case "6 month":
			return 6;
		case "9 month":
			return 9;
		case "year":
			return 12;
		default:
			throw new RuntimeException("Invalid Period Plan");
		}

	}

	public CustomerResponse renewMemberShip(Long CustomerId, Long PlanId) {
		Customer c = cr.findById(CustomerId).orElseThrow(() -> new ResourceNotFound("Customer not found"));
		Plan p = pr.findById(PlanId).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		int months = getPlanMonth(p.getPeriod());
		LocalDate d = LocalDate.now();
		LocalDate expd = c.getExpiryDate();
		LocalDate newExpd;
		if (expd != null && expd.isAfter(d)) {
			newExpd = expd.plusMonths(months);
		} else {
			newExpd = d.plusMonths(months);
		}
		c.setExpiryDate(newExpd);
		c.setPlan(p);
		Customer updateCustomer = cr.save(c);
		return customerMapToResponse(updateCustomer);
	}
}
