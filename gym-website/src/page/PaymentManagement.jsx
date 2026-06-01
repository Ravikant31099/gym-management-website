import { useEffect, useState } from "react";
import "../style/Admin.css";
import AdminSidebar from "../components/AdminSidebar";
import { apiRequest } from "../util/api";
import FormModal from "../components/modals/FormModal";
import PaymentViewModal from "../components/modals/PaymentViewModal";
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
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentForm, setPaymentForm] = useState({ customerId: "", planId: "", paymentMode: "UPI", status: "PAID", remarks: "" });

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
            setPaymentForm({ customerId: "", planId: "", paymentMode: "UPI", status: "PAID", remarks: "" });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setSaving(false);
        }
    };
    function DashboardCard({ title, value, color }) {
        return (
            <div className="dashboard-card">
                <div
                    className="dashboard-circle"
                    style={{ background: color }}
                />
                <h3>{title}</h3>
                <h1>{value}</h1>
                <p style={{ color }}>Live Data</p>
            </div>
        );
    };
    function DetailItem({ label, value }) {
        return (
            <div className="detail-item">
                <p className="detail-label">{label}</p>
                <p className="detail-value">{value}</p>
            </div>
        );
    };
    const getAmountValue = (amount) => {
        return Number(String(amount).replace("₹", "").replaceAll(",", "").trim());
    };
    const totalRevenue = payments.filter(payment => payment.status === "PAID").reduce((sum, payment) => sum + getAmountValue(payment.amount), 0);
    const pendingAmount = payments.filter(payment => payment.status === "PENDING").reduce((sum, payment) => sum + getAmountValue(payment.amount), 0);
    const totalPayments = payments.length;
    const todayCollection = payments.filter(payment => payment.paymentDate === new Date().toISOString().split("T")[0] && payment.status === "PAID").reduce((sum, payment) => sum + getAmountValue(payment.amount), 0);
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
                        <button className="add-Payments-btn" onClick={() => setShowAddModal(true)}>
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
                        <DashboardCard title="Today's Collection" value={`₹${todayCollection}`} color="#22c55e" />
                        <DashboardCard title="Total Revenue" value={`₹${totalRevenue}`} color="#3b82f6" />
                        <DashboardCard title="Pending Amount" value={`₹${pendingAmount}`} color="#f59e0b" />
                        <DashboardCard title="Total Payments" value={totalPayments} color="#8b5cf6" />
                    </div>
                </div>
                {/* Payments Table */}
                <div className="table-wrapper">
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
                            {payments.length === 0 ? (<tr>
                                <td colSpan="7">
                                    <div class="empty-state">
                                        <div class="empty-state__icon">
                                            <svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24">
                                                <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <h3 class="empty-state__title">No Records Found</h3>
                                        <p class="empty-state__description">
                                            There is no data to display in this table at the moment.
                                            New entries will appear here automatically.
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            ) : payments.map(payment => (
                                <tr key={payment.id} className="payment-clickable-row" onClick={() => { setSelectedPayment(payment); setShowPaymentModal(true); }}>
                                    <td>{payment.customerName}</td>
                                    <td>{payment.planName}</td>
                                    <td>{payment.amount}</td>
                                    <td>{payment.paymentDate}</td>
                                    <td><span className={`payment-status ${payment.status.toLowerCase()}`}>{payment.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Add Payments Modal */}
            {showAddModal && (<FormModal title="Add Payment" onClose={() => setShowAddModal(false)} onSubmit={savePayment} loading={saving} buttonText="Save Payment">
                <div className="form-group">
                    <select value={paymentForm.customerId} className="search-input" onChange={(e) => setPaymentForm({ ...paymentForm, customerId: e.target.value })}>
                        <option value="">Select Customer</option>
                        {customers.map(customer => (<option key={customer.id} value={customer.id}>{customer.name} </option>))}
                    </select>
                </div>
                <div className="form-group">
                    <select value={paymentForm.planId} className="search-input" onChange={(e) => setPaymentForm({ ...paymentForm, planId: e.target.value })}>
                        <option value="">Select Plan</option>
                        {plans.map(plan => (<option key={plan.id} value={plan.id}>    {plan.name} - {plan.price}</option>))}
                    </select>
                </div>
                <div className="form-group">
                    <select value={paymentForm.paymentMode} className="search-input" onChange={(e) => setPaymentForm({ ...paymentForm, paymentMode: e.target.value })}>
                        <option value="CASH">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="CARD">Card</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                </div>
                <div className="form-group">
                    <select value={paymentForm.status} className="search-input" onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })}>
                        <option value="PAID">Paid</option>
                        <option value="PENDING">Pending</option>
                        <option value="FAILED">Failed</option>
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
                    <DetailItem label="Payment Date" value={selectedPayment.paymentDate} />
                    <DetailItem label="Payment Mode" value={selectedPayment.paymentMode} />
                    <DetailItem label="Status" value={selectedPayment.status} />
                    <DetailItem label="Remarks" value={selectedPayment.remarks || "-"} />
                </PaymentViewModal>
            )}
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
};