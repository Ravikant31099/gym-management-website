import "../style/Admin.css";
import { useEffect, useState } from "react";
import { apiRequest, handleApiResponse } from "../util/api";
import { getAmountValue, formatCurrency, exportToCsv } from "../util/CommonUtil";
import { APP_CONFIG, PAYMENT_STATUS, PAYMENT_MODE, PAYMENT_DEFAULT_SORT, DEFAULT_FILTER } from "../constants/AppConstants";
import { AdminSidebar, Loader, DashboardCard, DetailItem, EmptyState } from "../components/common/index";
import { formatDate } from "../util/CommonUtil";
import { FileSpreadsheet, RefreshCcw } from "lucide-react";
import { ConfirmModal, FormModal, PaymentViewModal } from "../components/modals/index";
import AdminLayout from "../components/layout/AdminLayout";
import { toast } from "react-toastify";

export default function PaymentManagement() {
    const [payments, setPayments] = useState([]);
    const [plans, setPlans] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPaymentId, setSelectedPaymentId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState(DEFAULT_FILTER);
    const [modeFilter, setModeFilter] = useState(DEFAULT_FILTER);
    const [planFilter, setPlanFilter] = useState(DEFAULT_FILTER);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [sortBy, setSortBy] = useState("paymentDate");
    const [sortDir, setSortDir] = useState("desc");
    const resetFilters = () => { setSearchTerm(""); setStatusFilter(DEFAULT_FILTER); setModeFilter(DEFAULT_FILTER); setPlanFilter(DEFAULT_FILTER); setSortDir(PAYMENT_DEFAULT_SORT); setPage(0); };

    useEffect(() => { loadInitialData(); }, [debouncedSearch, page, statusFilter, planFilter, modeFilter, sortBy, sortDir]);
    useEffect(() => { setPage(0); }, [searchTerm, statusFilter, modeFilter, planFilter]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);
    const loadInitialData = async () => {
        try {
            setPageLoading(true);
            await Promise.all([
                fetchPlansForPayment(),
                fetchPayments(true)
            ]);
        } finally {
            setPageLoading(false);
        }
    };
    const fetchPayments = async (initialLoad = false) => {
        try {
            if (!initialLoad) {
                setTableLoading(true);
            }
            const params = new URLSearchParams({ page, size, search: searchTerm || "", status: statusFilter === DEFAULT_FILTER ? "" : statusFilter, mode: modeFilter === DEFAULT_FILTER ? "" : modeFilter, planId: planFilter === DEFAULT_FILTER ? "" : planFilter, sortBy, sortDir });
            const response = await apiRequest(`/api/payments?${params}`);
            await handleApiResponse(response);
            const data = await response.json();
            setPayments(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            if (!initialLoad) {
                setTableLoading(false);
            }
        }
    };
    const fetchPlansForPayment = async () => {
        try {
            const response = await apiRequest("/api/plans", "GET");
            await handleApiResponse(response);
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    const openDeletePayment = (paymentId) => {
        setSelectedPaymentId(paymentId);
        setShowDeleteModal(true);
    };
    const deletePayment = async () => {
        try {
            setDeleting(true);
            const response = await apiRequest(`/api/payments/${selectedPaymentId}`, { method: "DELETE" });
            await handleApiResponse(response);
            setPayments(payments.filter(payment => payment.id !== selectedPaymentId));
            toast.success("Payment deleted successfully");
            setShowDeleteModal(false);
            setSelectedPaymentId(null);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setDeleting(false);
        }
    };
    const handleExportPayments = async () => {
        try {
            setExporting(true);
            const params = new URLSearchParams();
            if (searchTerm.trim()) {
                params.append("search", searchTerm);
            }
            if (statusFilter !== DEFAULT_FILTER) {
                params.append("status", statusFilter);
            }
            if (modeFilter !== DEFAULT_FILTER) {
                params.append("mode", modeFilter);
            }
            if (planFilter !== DEFAULT_FILTER) {
                params.append("planId", planFilter);
            }
            params.append("sortBy", sortBy);
            params.append("sortDir", sortDir);
            const response = await apiRequest(`/api/payments/export?${params}`);
            await handleApiResponse(response);
            const data = await response.json();
            if (!data || data.length === 0) {
                toast.warning("No payment data found");
                return;
            }
            const headers = ["ID", "Customer", "Plan", "Amount", "Payment Mode", "Payment Status", "Payment Date", "Remarks"];
            const rows = data.map(payment => [payment.id, payment.customerName, payment.planName, payment.amount, payment.paymentMode, payment.status, payment.paymentDate, payment.remarks]);
            let fileName = "fitzone_payments";
            if (statusFilter !== DEFAULT_FILTER) {
                fileName += `_${statusFilter.toLowerCase()}`;
            }
            fileName += `_${new Date().toISOString().split("T")[0]}.csv`;
            exportToCsv(headers, rows, fileName);
            toast.success("Payment report exported successfully");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setExporting(false);
        }
    };
    if (pageLoading) {
        return (
            <AdminLayout>
                <Loader />
            </AdminLayout>
        );
    }
    return (
        <AdminLayout>
            <div className="header-card">
                <div>
                    <p className="admin-label"> ADMIN PANEL</p>
                    <h1 className="dashboard-title">Payments Management</h1>
                    <p className="dashboard-subtitle"> Manage Customer Payments and Subscriptions</p>
                </div>
                <div className="admin-badge">
                    <div className="badge-dot" />
                    <span> FitZone Admin</span>
                </div>
            </div>
            {/* Search and Filters */}
            <div className="search-filter-container">
                <input type="text" placeholder="Search Customer..." className="search-input" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                <select value={sortDir} onChange={(e) => { setSortDir(e.target.value); setPage(0); }} className="filter-select">
                    <option value="desc">👆 Newest First</option>
                    <option value="asc">👇 Oldest First</option>
                </select>
            </div>
            <div className="search-filter-container">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                    <option value={DEFAULT_FILTER}>All Status</option>
                    <option value={PAYMENT_STATUS.PAID}>Paid</option>
                    <option value={PAYMENT_STATUS.PENDING}>Pending</option>
                    <option value={PAYMENT_STATUS.FAILED}>Failed</option>
                </select>
                <select value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} className="filter-select">
                    <option value={DEFAULT_FILTER}>All Modes</option>
                    <option value={PAYMENT_MODE.UPI}> UPI</option>
                    <option value={PAYMENT_MODE.CASH}>Cash</option>
                    <option value={PAYMENT_MODE.CARD}>Card</option>
                    <option value={PAYMENT_MODE.BANK_TRANSFER}>Bank Transfer</option>
                </select>
                <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="filter-select">
                    <option value={DEFAULT_FILTER}>All Plans</option>
                    {plans.map(plan => (<option key={plan.id} value={plan.id}>{plan.name} </option>))}
                </select>
            </div>
            <div className="table-top">
                <div className="table-summary"> Total Payments: {totalElements}</div>
                <div>
                    <button className="export-btn" title="Export Customers to Excel" onClick={handleExportPayments}> {exporting ? "..." : ""} <FileSpreadsheet color="#30c40f" size={24} strokeWidth={2} /></button>
                    <button className="refresh-btn" onClick={resetFilters}> <RefreshCcw color="#2563EB" size={24} strokeWidth={2} /> </button>
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
                        {tableLoading ? (
                            <tr>
                                <td colSpan="5" className="table-loader">
                                    <Loader />
                                </td>
                            </tr>
                        ) : payments.length === 0 ? (<tr>
                            <td colSpan="5">
                                <EmptyState title="No Payments Found" description="There is no data to display in this table at the moment. New entries will appear here automatically." />
                            </td>
                        </tr>
                        ) : payments.map(payment => (
                            <tr key={payment.id} className="payment-clickable-row" onClick={() => { setSelectedPayment(payment); setShowPaymentModal(true); }}>
                                <td data-label="Customer">{payment.customerName}</td>
                                <td data-label="Plan">{payment.planName}</td>
                                <td data-label="Amount">{payment.amount}</td>
                                <td data-label="Date">{formatDate(payment.paymentDate)}</td>
                                <td data-label="Status"><span className={`payment-status ${payment.status.toLowerCase()}`}>{payment.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {/* Pagination Content*/}
            <div className="pagination-wrapper">
                <div className="pagination-container">
                    <button disabled={page === 0} onClick={() => setPage(prev => prev - 1)}>Previous</button>
                    <span> Page {page + 1} of {totalPages}</span>
                    <button disabled={page + 1 >= totalPages} onClick={() => setPage(prev => prev + 1)}>Next</button>
                </div>
            </div>
            {/* View Payment Modal */}
            {showPaymentModal && selectedPayment && (
                <PaymentViewModal title="Customer Details" onClose={() => setShowPaymentModal(false)} onDelete={() => { setShowPaymentModal(false); openDeletePayment(selectedPayment.id); }}>
                    <DetailItem label="Name" value={selectedPayment.customerName} />
                    <DetailItem label="Plan" value={selectedPayment.planName} />
                    <DetailItem label="Amount" value={selectedPayment.amount} />
                    <DetailItem label="Payment Date" value={formatDate(selectedPayment.paymentDate)} />
                    <DetailItem label="Payment Mode" value={selectedPayment.paymentMode} />
                    <DetailItem label="Status" value={selectedPayment.status} />
                    <DetailItem label="Remarks" value={selectedPayment.remarks || "-"} />
                </PaymentViewModal>
            )}
            {/* Delete Payment Modal */}
            {showDeleteModal && (<ConfirmModal title="Delete Payment" description="Are you sure you want to delete this Payment?" onClose={() => setShowDeleteModal(false)} onConfirm={deletePayment} loading={deleting} />)}
        </AdminLayout>
    );
};