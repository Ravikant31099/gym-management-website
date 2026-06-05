package com.fitzone.gymbackend.service;

import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Service;
import com.fitzone.gymbackend.dto.PaymentRequest;
import com.fitzone.gymbackend.dto.PaymentResponse;
import com.fitzone.gymbackend.entity.Customer;
import com.fitzone.gymbackend.entity.Payment;
import com.fitzone.gymbackend.entity.Plan;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.repository.CustomerRepository;
import com.fitzone.gymbackend.repository.PaymentRepository;
import com.fitzone.gymbackend.repository.PlanRepository;

@Service
public class PaymentService {

	private final PaymentRepository paymentRepository;
	private final CustomerRepository customerRepository;
	private final PlanRepository planRepository;

	public PaymentService(PaymentRepository paymentRepository, CustomerRepository customerRepository,
			PlanRepository planRepository) {
		this.paymentRepository = paymentRepository;
		this.customerRepository = customerRepository;
		this.planRepository = planRepository;
	}

	public List<PaymentResponse> getAllPayments() {
		return paymentRepository.findAll().stream().map(this::paymentMapToResponse).toList();
	}

	public PaymentResponse savePayment(PaymentRequest req) {
		Customer customer = customerRepository.findById(req.getCustomerId())
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		Plan plan = planRepository.findById(req.getPlanId()).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		Payment payment = new Payment();
		payment.setCustomer(customer);
		payment.setPlan(plan);
		payment.setAmount(plan.getPrice());
		payment.setPaymentDate(LocalDate.now());
		payment.setPaymentMode(req.getPaymentMode());
		payment.setStatus(req.getStatus());
		payment.setRemarks(req.getRemarks());
		return paymentMapToResponse(paymentRepository.save(payment));
	}

	public PaymentResponse updatePayment(Long id, PaymentRequest req) {
		Payment payment = paymentRepository.findById(id).orElseThrow(() -> new ResourceNotFound("Payment not found"));
		Customer customer = customerRepository.findById(req.getCustomerId())
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		Plan plan = planRepository.findById(req.getPlanId()).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		payment.setCustomer(customer);
		payment.setPlan(plan);
		payment.setAmount(plan.getPrice());
		payment.setPaymentMode(req.getPaymentMode());
		payment.setStatus(req.getStatus());
		payment.setRemarks(req.getRemarks());
		return paymentMapToResponse(paymentRepository.save(payment));
	}

	public void deletePayment(Long id) {
		Payment payment = paymentRepository.findById(id).orElseThrow(() -> new ResourceNotFound("Payment not found"));
		paymentRepository.delete(payment);
	}

	private PaymentResponse paymentMapToResponse(Payment payment) {
		return new PaymentResponse(payment.getId(), payment.getCustomer().getId(), payment.getCustomer().getName(),
				payment.getPlan().getId(), payment.getPlan().getName(), payment.getAmount(), payment.getPaymentDate(),
				payment.getPaymentMode(), payment.getStatus(), payment.getRemarks());
	}
}
