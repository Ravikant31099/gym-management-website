package com.fitzone.gymbackend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fitzone.gymbackend.entity.Plan;
import com.fitzone.gymbackend.repository.PlanRespository;
import com.fitzone.gymbackend.dto.CustomerRequest;
import com.fitzone.gymbackend.dto.CustomerResponse;
import com.fitzone.gymbackend.entity.Customer;
import com.fitzone.gymbackend.repository.CustomerRepository;

@Service
public class CustomerService {

	@Autowired
	private CustomerRepository cr;

	@Autowired
	private PlanRespository pr;

	public List<CustomerResponse> getAllCustomer() {
		return cr.findAll().stream().map(this::customerMapToResponse).toList();
	}

	public CustomerResponse saveCustomer(CustomerRequest c) {
		Plan plan = pr.findById(c.getPlanId()).orElseThrow(() -> new RuntimeException("Plan not found"));
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
		Customer cs = cr.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
		Plan plan = pr.findById(c.getPlanId()).orElseThrow(() -> new RuntimeException("Plan not found"));
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
		Customer cs = cr.findById(id).orElseThrow(() -> new RuntimeException("Customer not found"));
		cr.delete(cs);
	}

	private CustomerResponse customerMapToResponse(Customer c) {
		System.out.println("customer name " + c.getName());
	    System.out.println("customer email " + c.getEmail());
	    System.out.println("customer plan name " + c.getPlan().getName());
		return new CustomerResponse(c.getId(), c.getName(), c.getEmail(), c.getPhone(), c.getJoinDate(),
				c.getExpiryDate(), c.getStatus(), c.getPlan().getId(), c.getPlan().getName(), c.getPlan().getPrice());
	}
}
