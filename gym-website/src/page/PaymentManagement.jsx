import { useEffect, useState } from "react";
import "../style/Admin.css";
import AdminSidebar from "../components/common/AdminSidebar";
import { apiRequest } from "../util/api";
import { getAmountValue, formatCurrency } from "../util/CommonUtil";
import { APP_CONFIG, PAYMENT_STATUS, PAYMENT_MODE } from "../constants/AppConstants";
import FormModal from "../components/modals/FormModal";
import PaymentViewModal from "../components/modals/PaymentViewModal";
import ConfirmModal from "../components/modals/ConfirmModal";
import DashboardCard from "../components/common/DashboardCard";
import DetailItem from "../components/common/DetailItem";
import EmptyState from "../components/common/EmptyState";
import { formatDate } from "../util/CommonUtil";
import { toast, ToastContainer } from "react-toastify";

export default function PaymentManagement() {
    const [payments, setPayments] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [plans, setPlans] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPaymentId, setEditingPaymentId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [modeFilter, setModeFilter] = useState("ALL");
    const [planFilter, setPlanFilter] = useState("ALL");
    const [customerSearch, setCustomerSearch] = useState("");
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [paymentForm, setPaymentForm] = useState({ customerId: "", planId: "", paymentMode: PAYMENT_STATUS.PAID, status: PAYMENT_MODE.UPI, remarks: "" });

    useEffect(() => { fetchPayments(); fetchCustomersForPayments(); fetchPlansForPayments(); }, []);
    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await apiRequest("/api/payments");
            if (!response.ok) {
                toast.error("Failed to Fetch Payments");
                return;
            }
            const data = await response.json();
            setPayments(data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch Payments. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    const fetchCustomersForPayments = async () => {
        try {
            setLoading(true);
            const response = await apiRequest("/api/customers");
            if (!response.ok) {
                toast.error("Failed to Fetch Customer Records");
                return;
            }
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch Customer Records. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    const fetchPlansForPayments = async () => {
        try {
            const response = await apiRequest("/api/plans", "GET");
            if (!response.ok) {
                toast.error("Failed to Fetch Customer's Plans");
                return;
            }
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            toast.error("Failed to fetch plans. Please try again later.");
            console.log(error);
        }
    };
    const savePayment = async () => {
        try {
            setSaving(true);
            const response = await apiRequest("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(paymentForm)
            });
            if (!response.ok) {
                toast.error("Failed to save payment");
                return;
            }
            const savedPayment = await response.json();
            setPayments([...payments, savedPayment
            ]);
            toast.success("Payment added successfully");
            setShowAddModal(false);
            resetPaymentForm();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setSaving(false);
        }
    };
    const totalRevenue = payments.filter(payment => payment.status === "PAID").reduce((sum, payment) => sum + getAmountValue(payment.amount), 0);
    const pendingAmount = payments.filter(payment => payment.status === "PENDING").reduce((sum, payment) => sum + getAmountValue(payment.amount), 0);
    const totalPayments = payments.length;
    const todayCollection = payments.filter(payment => payment.paymentDate === new Date().toISOString().split("T")[0] && payment.status === "PAID").reduce((sum, payment) => sum + getAmountValue(payment.amount), 0);
    const openEditPayment = (payment) => {
        setEditingPaymentId(payment.id);
        setPaymentForm({
            customerId: payment.customerId,
            planId: payment.planId,
            paymentMode: payment.paymentMode,
            status: payment.status,
            remarks: payment.remarks || ""
        });
        setCustomerSearch(payment.customerName);
        setShowEditModal(true);
    };
    const openDeletePayment = (paymentId) => {
        setSelectedPaymentId(paymentId);
        setShowDeleteModal(true);
    };
    const updatePayment = async () => {
        try {
            setUpdating(true);
            const response =
                await apiRequest(`/api/payments/${editingPaymentId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(paymentForm) });
            if (!response.ok) {
                toast.error("Failed to update payment");
                return;
            }
            const updatedPayment = await response.json();
            setPayments(payments.map(payment => payment.id === editingPaymentId ? updatedPayment : payment));
            toast.success("Payment updated successfully");
            setShowEditModal(false);
            setEditingPaymentId(null);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setUpdating(false);
        }
    };
    const deletePayment = async () => {
        try {
            setDeleting(true);
            const response = await apiRequest(`/api/payments/${selectedPaymentId}`, { method: "DELETE" });
            if (!response.ok) {
                toast.error("Failed to delete payment");
                return;
            }
            setPayments(payments.filter(payment => payment.id !== selectedPaymentId));
            toast.success("Payment deleted successfully");
            setShowDeleteModal(false);
            setSelectedPaymentId(null);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setDeleting(false);
        }
    };
    const filteredPayments = payments.filter(payment => {
        const matchesSearch = payment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || payment.planName?.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === "ALL" || payment.status === statusFilter;
        const matchesMode = modeFilter === "ALL" || payment.paymentMode === modeFilter;
        const matchesPlan = planFilter === "ALL" || payment.planName === planFilter;
        return (matchesSearch && matchesStatus && matchesMode && matchesPlan);
    });
    const handleCustomerSearch = (value) => {
        setCustomerSearch(value);
        if (!value.trim()) {
            setFilteredCustomers([]);
            return;
        }
        const filtered = customers.filter(customer => customer.name.toLowerCase().includes(value.toLowerCase()) || customer.phone?.includes(value));
        setFilteredCustomers(filtered);
    };
    const resetPaymentForm = () => {
        setPaymentForm({ customerId: "", planId: "", paymentMode: "UPI", status: "PAID", remarks: "" });
        setCustomerSearch("");
        setFilteredCustomers([]);
    };
    return (
        <div className="admin-container">
            <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="main-content">
                <button className="mobile-nav-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
                <div className="header-card">
                    <div>
                        <p className="admin-label"> ADMIN PANEL</p>
                        <h1 className="dashboard-title">Payments Management</h1>
                        <p className="dashboard-subtitle"> Manage Customer Payments and Subscriptions</p>
                    </div>
                    <div>
                        <button className="add-Payments-btn" onClick={() => { resetPaymentForm(); setShowAddModal(true) }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>Add Payments
                        </button>
                    </div>
                </div>
                {/* Summary Cards */}
                <div className="dashboard-section">
                    <h3 className="cards-header"> Payment Summary </h3>
                    <div className="cards-grid">
                        <DashboardCard title="Today's Collection" value={`${formatCurrency(todayCollection)}`} color="#22c55e" />
                        <DashboardCard title="Total Revenue" value={`${formatCurrency(totalRevenue)}`} color="#3b82f6" />
                        <DashboardCard title="Pending Amount" value={`${formatCurrency(pendingAmount)}`} color="#f59e0b" />
                        <DashboardCard title="Total Payments" value={totalPayments} color="#8b5cf6" />
                    </div>
                </div>
                {/* Search and Filters */}
                <div className="search-filter-container">
                    <input type="text" placeholder="Search Customer..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                        <option value="ALL">All Status</option>
                        <option value="PAID">Paid</option>
                        <option value="PENDING">Pending</option>
                        <option value="FAILED">Failed</option>
                    </select>
                    <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} className="filter-select">
                        <option value="ALL">All Modes</option>
                        <option value="UPI"> UPI</option>
                        <option value="CASH">Cash</option>
                        <option value="CARD">Card</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                    <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="filter-select">
                        <option value="ALL">All Plans</option>
                        {plans.map(plan => (<option key={plan.id} value={plan.name}>{plan.name} </option>))}
                    </select>
                </div>
                {/* Payments Table */}
                <div className="table-wrapper">
                    <div className="table-header">
                        <h3> Payments <span className="table-header-count"> ({filteredPayments.length})</span></h3>
                    </div>
                    <table className="payments-table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Plan</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayments.length === 0 ? (<tr>
                                <td colSpan="7">
                                    <EmptyState title="No Payments Found" description="There is no data to display in this table at the moment. New entries will appear here automatically." />
                                </td>
                            </tr>
                            ) : filteredPayments.map(payment => (
                                <tr key={payment.id} className="payment-clickable-row" onClick={() => { setSelectedPayment(payment); setShowPaymentModal(true); }}>
                                    <td>{payment.customerName}</td>
                                    <td>{payment.planName}</td>
                                    <td>{payment.amount}</td>
                                    <td>{formatDate(payment.paymentDate)}</td>
                                    <td><span className={`payment-status ${payment.status.toLowerCase()}`}>{payment.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Add Payments Modal */}
            {showAddModal && (<FormModal title="Add Payment" onClose={() => { resetPaymentForm(); setShowAddModal(false) }} onSubmit={savePayment} loading={saving} buttonText="Save Payment">
                <div className="form-group">
                    <div className="autocomplete-wrapper">
                        <input type="text" className="search-input" placeholder="Search Customer" value={customerSearch} onChange={(e) => handleCustomerSearch(e.target.value)} />
                        {filteredCustomers.length > 0 && (
                            <div className="suggestions-dropdown">
                                {filteredCustomers.map(
                                    customer => (
                                        <div key={customer.id} className="suggestion-item" onClick={() => { setPaymentForm({ ...paymentForm, customerId: customer.id }); setCustomerSearch(customer.name); setFilteredCustomers([]); }}><small>{customer.name} - </small><small>{customer.phone}</small>

                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="form-group">
                    <select value={paymentForm.planId} className="filter-select-modal" onChange={(e) => setPaymentForm({ ...paymentForm, planId: e.target.value })}>
                        <option value="">Select Plan</option>
                        {plans.map(plan => (<option key={plan.id} value={plan.id}>    {plan.name} - {plan.price}</option>))}
                    </select>
                </div>
                <div className="form-group">
                    <select value={paymentForm.paymentMode} className="filter-select-modal" onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}>
                        <option value={PAYMENT_MODE.CASH}>Cash</option>
                        <option value={PAYMENT_MODE.UPI}>UPI</option>
                        <option value={PAYMENT_MODE.CARD}>Card</option>
                        <option value={PAYMENT_MODE.BANK_TRANSFER}>Bank Transfer</option>
                    </select>
                </div>
                <div className="form-group">
                    <select value={paymentForm.status} className="filter-select-modal" onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}>
                        <option value={PAYMENT_STATUS.PAID}>Paid</option>
                        <option value={PAYMENT_STATUS.PENDING}>Pending</option>
                        <option value={PAYMENT_STATUS.FAILED}>Failed</option>
                    </select>
                </div>
                <div className="form-group full-width">
                    <input type="text" placeholder="Enter Remarks" className="search-input" value={paymentForm.remarks} onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })} />
                </div>
            </FormModal>
            )}
            {/* View Payment Modal */}
            {showPaymentModal && selectedPayment && (
                <PaymentViewModal title="Customer Details" onClose={() => setShowPaymentModal(false)} onEdit={() => { setShowPaymentModal(false); openEditPayment(selectedPayment); }} onDelete={() => { setShowPaymentModal(false); openDeletePayment(selectedPayment.id); }}>
                    <DetailItem label="Name" value={selectedPayment.customerName} />
                    <DetailItem label="Plan" value={selectedPayment.planName} />
                    <DetailItem label="Amount" value={selectedPayment.amount} />
                    <DetailItem label="Payment Date" value={formatDate(selectedPayment.paymentDate)} />
                    <DetailItem label="Payment Mode" value={selectedPayment.paymentMode} />
                    <DetailItem label="Status" value={selectedPayment.status} />
                    <DetailItem label="Remarks" value={selectedPayment.remarks || "-"} />
                </PaymentViewModal>
            )}
            {/* Edit Payment Modal */}
            {showEditModal && (<FormModal title="Edit Payment" onClose={() => setShowEditModal(false)} onSubmit={updatePayment} loading={updating} buttonText="Update Payment">
                <div className="form-group">
                    <div className="autocomplete-wrapper">
                        <input type="text" className="search-input" placeholder="Search Customer" value={customerSearch} onChange={(e) => handleCustomerSearch(e.target.value)} />
                        {
                            filteredCustomers.length > 0 && (
                                <div className="suggestions-dropdown">
                                    {filteredCustomers.map(
                                        customer => (
                                            <div key={customer.id} className="suggestion-item" onClick={() => { setPaymentForm({ ...paymentForm, customerId: customer.id }); setCustomerSearch(customer.name); setFilteredCustomers([]); }}><small>{customer.name} - </small><small>{customer.phone}</small>
                                            </div>
                                        ))}
                                </div>
                            )}
                    </div>
                </div>
                <div className="form-group">
                    <select value={paymentForm.planId} className="filter-select-modal" onChange={(e) => setPaymentForm({ ...paymentForm, planId: e.target.value })}>
                        <option value="">Select Plan</option>
                        {plans.map(plan => (<option key={plan.id} value={plan.id}>    {plan.name} - {plan.price}</option>))}
                    </select>
                </div>
                <div className="form-group">
                    <select value={paymentForm.paymentMode} className="filter-select-modal" onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}>
                        <option value={PAYMENT_MODE.CASH}>Cash</option>
                        <option value={PAYMENT_MODE.UPI}>UPI</option>
                        <option value={PAYMENT_MODE.CARD}>Card</option>
                        <option value={PAYMENT_MODE.BANK_TRANSFER}>Bank Transfer</option>
                    </select>
                </div>
                <div className="form-group">
                    <select value={paymentForm.status} className="filter-select-modal" onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}>
                        <option value={PAYMENT_STATUS.PAID}>Paid</option>
                        <option value={PAYMENT_STATUS.PENDING}>Pending</option>
                        <option value={PAYMENT_STATUS.FAILED}>Failed</option>
                    </select>
                </div>
                <div className="form-group full-width">
                    <input type="text" placeholder="Enter Remarks" className="search-input" value={paymentForm.remarks} onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })} />
                </div>
            </FormModal>
            )}
            {/* Delete Payment Modal */}
            {showDeleteModal && (<ConfirmModal title="Delete Payment" description="Are you sure you want to delete this Payment?" onClose={() => setShowDeleteModal(false)} onConfirm={deletePayment} loading={deleting} />)}
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
};