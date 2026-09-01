package com.fitzone.gymbackend.service;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.fitzone.gymbackend.constant.CustomerConstants;
import com.fitzone.gymbackend.dto.PaymentAnalyticsResponse;
import com.fitzone.gymbackend.dto.PaymentRequest;
import com.fitzone.gymbackend.dto.PaymentResponse;
import com.fitzone.gymbackend.dto.PaymentSummaryResponse;
import com.fitzone.gymbackend.dto.RevenueByMonthResponse;
import com.fitzone.gymbackend.dto.RevenueByPlanResponse;
import com.fitzone.gymbackend.entity.Customer;
import com.fitzone.gymbackend.entity.Payment;
import com.fitzone.gymbackend.entity.Plan;
import com.fitzone.gymbackend.enums.ActivityType;
import com.fitzone.gymbackend.exception.BusinessException;
import com.fitzone.gymbackend.exception.ResourceNotFound;
import com.fitzone.gymbackend.repository.CustomerRepository;
import com.fitzone.gymbackend.repository.PaymentRepository;
import com.fitzone.gymbackend.repository.PlanRepository;

import jakarta.transaction.Transactional;

@Service
public class PaymentService {

	private static final int MAX_PAGE_SIZE = 100;
	private static final int REVENUE_WINDOW_MONTHS = 12;

	private final PaymentRepository paymentRepository;
	private final CustomerRepository customerRepository;
	private final PlanRepository planRepository;
	private final AuditLogService auditLogService;

	public PaymentService(PaymentRepository paymentRepository, CustomerRepository customerRepository,
			PlanRepository planRepository, AuditLogService auditLogService) {
		this.paymentRepository = paymentRepository;
		this.customerRepository = customerRepository;
		this.planRepository = planRepository;
		this.auditLogService = auditLogService;
	}

	public Page<PaymentResponse> getPayments(String search, String status, String mode, Long planId, Pageable pageable,
			String sortBy, String sortDir) {
		int safeSize = clampPageSize(pageable.getPageSize());
		int safePage = Math.max(pageable.getPageNumber(), 0);
		Sort sort = "asc".equalsIgnoreCase(sortDir) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
		Pageable sortedPageable = PageRequest.of(safePage, safeSize, sort);
		Page<Payment> payments = paymentRepository.searchPayments(emptyToNull(search), emptyToNull(status),
				emptyToNull(mode), planId, sortedPageable);
		return payments.map(this::paymentMapToResponse);
	}

	@Transactional
	public PaymentResponse savePayment(PaymentRequest req) {
		Customer customer = customerRepository.findById(req.getCustomerId())
				.orElseThrow(() -> new ResourceNotFound("Customer not found"));
		Plan plan = planRepository.findById(req.getPlanId()).orElseThrow(() -> new ResourceNotFound("Plan not found"));

		if (Boolean.TRUE.equals(customer.getArchived())) {
			throw new BusinessException("Cannot create payment for an archived customer");
		}
		if (!Boolean.TRUE.equals(plan.getActive())) {
			throw new BusinessException("Cannot create payment for inactive plan");
		}
		if (req.getStatus() == null
				|| !CustomerConstants.VALID_STATUSES.contains(req.getStatus().toUpperCase(Locale.ROOT))) {
			throw new BusinessException("Invalid payment status");
		}
		if (req.getPaymentMode() == null
				|| !CustomerConstants.VALID_MODES.contains(req.getPaymentMode().toUpperCase(Locale.ROOT))) {
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
		auditLogService.logActivity("PAYMENT", savedPayment.getId(), ActivityType.PAYMENT_CREATED,
				"Payment received from '" + savedPayment.getCustomer().getName() + "' for Rs. "
						+ savedPayment.getAmount());
		return paymentMapToResponse(savedPayment);
	}

	@Transactional
	public void deletePayment(Long id) {
		Payment payment = paymentRepository.findById(id).orElseThrow(() -> new ResourceNotFound("Payment not found"));
		String customerName = payment.getCustomer().getName();
		var amount = payment.getAmount();
		paymentRepository.delete(payment);
		auditLogService.logActivity("PAYMENT", payment.getId(), ActivityType.PAYMENT_DELETED,
				"Payment record for '" + customerName + "' (amount: " + amount + ") was deleted.");
	}

	public PaymentAnalyticsResponse getAnalytics() {
		PaymentAnalyticsResponse response = new PaymentAnalyticsResponse();
		response.setSummary(getSummary());
		List<RevenueByPlanResponse> revenueByPlan = paymentRepository.getRevenueByPlan();
		response.setRevenueByPlan(revenueByPlan);
		response.setPaymentModes(paymentRepository.getPaymentModeDistribution());
		response.setRevenueByMonth(buildRevenueByMonth());
		response.setTopPlans(revenueByPlan.stream().limit(5).toList());
		return response;
	}

	private PaymentSummaryResponse getSummary() {
		return new PaymentSummaryResponse(paymentRepository.getTotalRevenue(), paymentRepository.getPendingRevenue(),
				paymentRepository.getTodayCollection(LocalDate.now()), paymentRepository.getTotalTransactions());
	}

	private List<RevenueByMonthResponse> buildRevenueByMonth() {
		LocalDate end = LocalDate.now();
		LocalDate start = end.minusMonths(REVENUE_WINDOW_MONTHS - 1L).withDayOfMonth(1);

		List<Object[]> rows = paymentRepository.findMonthlyRevenue(start, end);
		Map<String, Double> totalsByKey = new HashMap<>();
		for (Object[] row : rows) {
			int year = ((Number) row[0]).intValue();
			int month = ((Number) row[1]).intValue();
			double total = ((Number) row[2]).doubleValue();
			totalsByKey.put(year + "-" + month, total);
		}

		List<RevenueByMonthResponse> result = new ArrayList<>(REVENUE_WINDOW_MONTHS);
		LocalDate cursor = start;
		for (int i = 0; i < REVENUE_WINDOW_MONTHS; i++) {
			String key = cursor.getYear() + "-" + cursor.getMonthValue();
			double total = totalsByKey.getOrDefault(key, 0.0);
			String label = Month.of(cursor.getMonthValue()).getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " "
					+ cursor.getYear();
			result.add(new RevenueByMonthResponse(label, total));
			cursor = cursor.plusMonths(1);
		}
		return result;
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

	private int clampPageSize(int size) {
		if (size <= 0) {
			return 10;
		}
		return Math.min(size, MAX_PAGE_SIZE);
	}
}