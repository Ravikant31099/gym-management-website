package com.fitzone.gymbackend.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.fitzone.gymbackend.dto.PaymentRequest;
import com.fitzone.gymbackend.dto.PaymentResponse;
import com.fitzone.gymbackend.entity.Customer;
import com.fitzone.gymbackend.entity.Payment;
import com.fitzone.gymbackend.entity.Plan;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.repository.CustomerRepository;
import com.fitzone.gymbackend.repository.PaymentRespository;
import com.fitzone.gymbackend.repository.PlanRespository;

@Service
public class PaymentService {

	@Autowired
	private PaymentRespository pR;

	@Autowired
	private CustomerRepository cR;

	@Autowired
	private PlanRespository plR;

	public List<PaymentResponse> getAllPayments() {
		return pR.findAll().stream().map(this::PaymentMapToResponse).toList();
	}

	public PaymentResponse savePayment(PaymentRequest req) {
		Customer customer = cR.findById(req.getCustomerId())
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		Plan plan = plR.findById(req.getPlanId()).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		Payment p = new Payment();
		p.setCustomer(customer);
		p.setPlan(plan);
		p.setAmount(plan.getPrice());
		p.setPaymentDate(LocalDate.now());
		p.setPaymentMode(req.getPaymentMode());
		p.setStatus(req.getStatus());
		p.setRemarks(req.getRemarks());
		Payment savedPayment = pR.save(p);
		return PaymentMapToResponse(savedPayment);
	}

	public PaymentResponse updatePayment(Long id, PaymentRequest req) {
		Payment p = pR.findById(id).orElseThrow(() -> new ResourceNotFound("Payment not found"));
		Customer c = cR.findById(req.getCustomerId()).orElseThrow(() -> new ResourceNotFound("Customer not found"));
		Plan pl = plR.findById(req.getPlanId()).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		p.setCustomer(c);
		p.setPlan(pl);
		p.setAmount(pl.getPrice());
		p.setPaymentMode(req.getPaymentMode());
		p.setStatus(req.getStatus());
		p.setRemarks(req.getRemarks());
		Payment uP = pR.save(p);
		return PaymentMapToResponse(uP);
	}

	public void deletePayment(Long id) {
		Payment payment = pR.findById(id).orElseThrow(() -> new ResourceNotFound("Payment not found"));
		pR.delete(payment);
	}

	private PaymentResponse PaymentMapToResponse(Payment payment) {
		return new PaymentResponse(payment.getId(), payment.getCustomer().getId(), payment.getCustomer().getName(),
				payment.getPlan().getId(), payment.getPlan().getName(), payment.getAmount(), payment.getPaymentDate(),
				payment.getPaymentMode(), payment.getStatus(), payment.getRemarks());
	}
	
}
