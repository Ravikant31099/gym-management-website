package com.fitzone.gymbackend.service;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

import com.fitzone.gymbackend.dto.PaymentAnalyticsResponse;
import com.fitzone.gymbackend.dto.PaymentRequest;
import com.fitzone.gymbackend.dto.PaymentResponse;
import com.fitzone.gymbackend.dto.PaymentSummaryResponse;
import com.fitzone.gymbackend.dto.RevenueByMonthResponse;
import com.fitzone.gymbackend.entity.Customer;
import com.fitzone.gymbackend.entity.Payment;
import com.fitzone.gymbackend.entity.Plan;
import com.fitzone.gymbackend.exception.BusinessException;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.repository.CustomerRepository;
import com.fitzone.gymbackend.repository.PaymentRepository;
import com.fitzone.gymbackend.repository.PlanRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.fitzone.gymbackend.constant.CustomerConstants;

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

	public Page<PaymentResponse> getPayments(String search, String status, String mode, Long planId, Pageable pageable,
			String sortBy, String sortDir) {
		Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), sort);
		Page<Payment> payments = paymentRepository.searchPayments(emptyToNull(search), emptyToNull(status),
				emptyToNull(mode), planId, sortedPageable);
		return payments.map(this::paymentMapToResponse);
	}

	public PaymentResponse savePayment(PaymentRequest req) {
		Customer customer = customerRepository.findById(req.getCustomerId())
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		Plan plan = planRepository.findById(req.getPlanId()).orElseThrow(() -> new ResourceNotFound("Plan not found"));
		if (!Boolean.TRUE.equals(customer.getArchived())) {
			throw new BusinessException("Cannot create payment for archived customer");
		}
		if (!Boolean.TRUE.equals(plan.getActive())) {
			throw new BusinessException("Cannot create payment for inactive plan");
		}
		if (!CustomerConstants.VALID_STATUSES.contains(req.getStatus().toUpperCase())) {
			throw new BusinessException("Invalid payment status");
		}
		if (!CustomerConstants.VALID_MODES.contains(req.getPaymentMode().toUpperCase())) {
			throw new BusinessException("Invalid payment mode");
		}
		Payment payment = new Payment();
		payment.setCustomer(customer);
		payment.setPlan(plan);
		payment.setAmount(plan.getPrice());
		payment.setPaymentDate(LocalDate.now());
		payment.setPaymentMode(req.getPaymentMode());
		payment.setStatus(req.getStatus());
		payment.setRemarks(req.getRemarks());
		Payment savedPayment = paymentRepository.save(payment);
		return paymentMapToResponse(savedPayment);
	}

	public void deletePayment(Long id) {
		Payment payment = paymentRepository.findById(id).orElseThrow(() -> new ResourceNotFound("Payment not found"));
		paymentRepository.delete(payment);
	}

	public PaymentAnalyticsResponse getAnalytics() {
		PaymentAnalyticsResponse response = new PaymentAnalyticsResponse();
		response.setSummary(getSummary());
		response.setRevenueByPlan(paymentRepository.getRevenueByPlan());
		response.setPaymentModes(paymentRepository.getPaymentModeDistribution());
		response.setRevenueByMonth(buildRevenueByMonth());
		response.setTopPlans(paymentRepository.getTopPlans().stream().limit(5).toList());
		return response;
	}

	private PaymentSummaryResponse getSummary() {
		return new PaymentSummaryResponse(paymentRepository.getTotalRevenue(), paymentRepository.getPendingRevenue(),
				paymentRepository.getTodayCollection(LocalDate.now()), paymentRepository.getTotalTransactions());
	}

	private List<RevenueByMonthResponse> buildRevenueByMonth() {
		List<Payment> payments = paymentRepository.findAll();
		Map<String, Double> revenueMap = payments.stream().filter(p -> "PAID".equalsIgnoreCase(p.getStatus()))
				.collect(Collectors.groupingBy(
						p -> p.getPaymentDate().getYear() + "-"
								+ String.format("%02d", p.getPaymentDate().getMonthValue()),
						Collectors.summingDouble(p -> p.getAmount().doubleValue())));
		return revenueMap.entrySet().stream().sorted(Map.Entry.comparingByKey()).map(entry -> {
			String[] split = entry.getKey().split("-");
			int year = Integer.parseInt(split[0]);
			int month = Integer.parseInt(split[1]);
			String label = Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + year;
			return new RevenueByMonthResponse(label, entry.getValue());
		}).toList();
	}

	public List<PaymentResponse> exportPayments(String search, String status, String mode, Long planId) {
		List<Payment> payments = paymentRepository.exportPayments(emptyToNull(search), emptyToNull(status),
				emptyToNull(mode), planId);
		return payments.stream().map(this::paymentMapToResponse).toList();
	}

	private String emptyToNull(String value) {
		return (value == null || value.isBlank()) ? null : value;
	}

	private PaymentResponse paymentMapToResponse(Payment payment) {
		PaymentResponse response = new PaymentResponse();
		response.setId(payment.getId());
		response.setCustomerId(payment.getCustomer().getId());
		response.setCustomerName(payment.getCustomer().getName());
		response.setPlanId(payment.getPlan().getId());
		response.setPlanName(payment.getPlan().getName());
		response.setAmount(payment.getAmount());
		response.setPaymentDate(payment.getPaymentDate());
		response.setPaymentMode(payment.getPaymentMode());
		response.setStatus(payment.getStatus());
		response.setRemarks(payment.getRemarks());
		return response;
	}
}
