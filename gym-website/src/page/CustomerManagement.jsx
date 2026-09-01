import "../style/Admin.css";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect, useRef, useState } from "react";
import { apiRequest, handleApiResponse } from "../util/api";
import { formatDate, getMembershipStatus, allowOnlyAlphabets, allowOnlyNumbers, exportToCsv } from "../util/CommonUtil";
import { CUSTOMER_STATUS, PAYMENT_STATUS, PAYMENT_MODE, CUSTOMER_DEFAULT_SORT, DEFAULT_FILTER } from "../constants/AppConstants";
import { Loader, EmptyState } from "../components/common/index";
import { Trash2, FileSpreadsheet, RefreshCcw } from "lucide-react";
import { ConfirmModal, FormModal } from "../components/modals/index";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import AdminLayout from "../components/layout/AdminLayout";
import { toast } from "react-toastify";

export default function CustomerManagement() {
    const [customers, setCustomers] = useState([]);
    const [plans, setPlans] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState(DEFAULT_FILTER);
    const [planFilter, setPlanFilter] = useState(DEFAULT_FILTER);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [customerForm, setCustomerForm] = useState({ name: "", email: "", phone: "", joinDate: "", status: "ACTIVE", planId: "", paymentMode: "UPI", paymentStatus: "PAID", paymentRemarks: "" });
    const [sortBy, setSortBy] = useState("name");
    const [sortDir, setSortDir] = useState(CUSTOMER_DEFAULT_SORT);
    const navigate = useNavigate();
    const latestRequestId = useRef(0);
    const resetFilters = () => { setSearchTerm(""); setStatusFilter(DEFAULT_FILTER); setPlanFilter(DEFAULT_FILTER); setSortDir(CUSTOMER_DEFAULT_SORT); setPage(0); };

    useEffect(() => {
        fetchPlansForCustomer();
    }, []);

    useEffect(() => {
        loadCustomerTable();
    }, [debouncedSearch, page, statusFilter, planFilter, sortBy, sortDir]);

    useEffect(() => { setPage(0); }, [searchTerm, statusFilter, planFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const loadCustomerTable = async () => {
        try {
            setPageLoading((prev) => (customers.length === 0 ? true : prev));
            await fetchCustomers(customers.length === 0);
        } finally {
            setPageLoading(false);
        }
    };

    const fetchCustomers = async (initialLoad = false) => {
        const requestId = ++latestRequestId.current;
        try {
            if (!initialLoad) {
                setTableLoading(true);
            }
            const params = new URLSearchParams({ page, size });
            if (debouncedSearch.trim()) {
                params.append("search", debouncedSearch.trim());
            }
            if (statusFilter !== DEFAULT_FILTER) {
                params.append("status", statusFilter);
            }
            if (planFilter !== DEFAULT_FILTER) {
                params.append("planId", planFilter);
            }
            params.append("sortBy", sortBy);
            params.append("sortDir", sortDir);
            const response = await apiRequest(`/api/customers?${params}`);
            await handleApiResponse(response);
            const data = await response.json();
            if (requestId !== latestRequestId.current) {
                return;
            }
            setCustomers(data.content);
            setTotalPages(data.totalPages);
            setTotalRecords(data.totalElements);
        } catch (error) {
            if (requestId === latestRequestId.current) {
                console.log(error);
                toast.error(error.message);
            }
        } finally {
            if (requestId === latestRequestId.current && !initialLoad) {
                setTableLoading(false);
            }
        }
    };

    const fetchPlansForCustomer = async () => {
        try {
            const response = await apiRequest("/api/plans");
            await handleApiResponse(response);
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const validateForm = () => {
        if (!customerForm.name.trim()) {
            toast.error("Name is required");
            return false;
        }
        if (!customerForm.email.trim()) {
            toast.error("Email is required");
            return false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.email)) {
            toast.error("Invalid email");
            return false;
        }
        if (!customerForm.phone.trim()) {
            toast.error("Phone is required");
            return false;
        } else if (!/^\d{10}$/.test(customerForm.phone)) {
            toast.error("Phone must be 10 digits");
            return false;
        }
        if (!customerForm.joinDate) {
            toast.error("Join date required");
            return false;
        }
        if (!customerForm.planId) {
            toast.error("Select a plan");
            return false;
        }
        return true;
    };

    const handleAddCustomer = async (e) => {
        e.preventDefault();
        setSaving(true);
        if (!validateForm()) {
            setSaving(false);
            return;
        }
        try {
            const response = await apiRequest("/api/customers", { method: "POST", body: JSON.stringify(customerForm) });
            await handleApiResponse(response);
            await response.json();
            toast.success("Customer Added Successfully");
            setShowAddModal(false);
            resetCustomerForm();
            fetchCustomers();
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        let { name, value } = e.target;
        if (name === "name") {
            value = allowOnlyAlphabets(value);
        }
        if (name === "phone") {
            value = allowOnlyNumbers(value).slice(0, 10);
        }
        setCustomerForm({ ...customerForm, [name]: value });
    };

    const handleDeleteClick = (id) => {
        setSelectedCustomerId(id);
        setShowDeleteModal(true);
    };

    const deleteCustomer = async () => {
        try {
            setDeleting(true);
            const response = await apiRequest(`/api/customers/${selectedCustomerId}`, { method: "DELETE" });
            await handleApiResponse(response);
            toast.success("Customer Deleted Successfully");
            setShowDeleteModal(false);
            setSelectedCustomerId(null);
            fetchCustomers();
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setDeleting(false);
        }
    };

    const handleViewCustomer = (customer) => {
        navigate(`/admin/customers/${customer.id}`);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setPage(0);
    };

    const resetCustomerForm = () => {
        setCustomerForm({ name: "", email: "", phone: "", joinDate: "", status: "ACTIVE", planId: "", paymentMode: "UPI", paymentStatus: "PAID", paymentRemarks: "" });
    };

    const handleExportCustomers = async () => {
        try {
            setExporting(true);
            const params = new URLSearchParams();
            if (debouncedSearch.trim()) {
                params.append("search", debouncedSearch.trim());
            }
            if (statusFilter !== DEFAULT_FILTER) {
                params.append("status", statusFilter);
            }
            if (planFilter !== DEFAULT_FILTER) {
                params.append("planId", planFilter);
            }
            const response = await apiRequest(`/api/customers/export?${params}`);
            await handleApiResponse(response);
            const data = await response.json();
            if (!data || data.length === 0) {
                toast.warning("No customer data found");
                return;
            }
            const headers = ["ID", "Name", "Email", "Phone", "Plan", "Status", "Join Date", "Expiry Date", "Days Remaining"];
            const rows = data.map(customer => [customer.id, customer.name, customer.email, customer.phone, customer.planName, customer.status, customer.joinDate, customer.expiryDate, customer.daysRemaining]);
            let fileName = "fitzone_customers";
            if (statusFilter !== DEFAULT_FILTER) {
                fileName += `_${statusFilter.toLowerCase()}`;
            }
            fileName += `_${new Date().toISOString().split("T")[0]}.csv`;
            exportToCsv(headers, rows, fileName);
            toast.success("Customer report exported successfully");
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
                    <h1 className="dashboard-title">Customer Management</h1>
                    <p className="dashboard-subtitle"> Manage gym customers and memberships</p>
                </div>
                <div>
                    <button className="add-customer-btn" onClick={() => { resetCustomerForm(); setShowAddModal(true) }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Customer</button>
                </div>
            </div>
            {/* SEARCH */}
            <div className="search-filter-container">
                <input type="text" placeholder="Search by Name, Phone or Email" value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} className="search-input" />
            </div>
            <div className="search-filter-container">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                    <option value={DEFAULT_FILTER}> All Status </option>
                    <option value={CUSTOMER_STATUS.ACTIVE}> Active </option>
                    <option value={CUSTOMER_STATUS.EXPIRING}> Expiring </option>
                    <option value={CUSTOMER_STATUS.EXPIRED}> Expired </option>
                    <option value={CUSTOMER_STATUS.INACTIVE}> Inactive </option>
                </select>
                <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="filter-select">
                    <option value={DEFAULT_FILTER}> All Plans</option>
                    {Array.isArray(plans) && plans.map((plan) => (<option key={plan.id} value={plan.id}>{plan.name}</option>))}
                </select>
                <select className="filter-select" value={`${sortBy}-${sortDir}`} onChange={(e) => { const [field, direction] = e.target.value.split("-"); setSortBy(field); setSortDir(direction); }}>
                    <option value="name-asc">🔤 Name (A to Z)</option>
                    <option value="name-desc">🔤 Name (Z to A)</option>
                    <option value="plan-asc">📊 Plan (Low to High)</option>
                    <option value="plan-desc">📊 Plan (High to Low)</option>
                    <option value="expiryDate-asc">⏳ Expiring Soonest</option>
                    <option value="expiryDate-desc">📅 Expiring Latest</option>
                </select>
            </div>
            {/* TABLE */}
            <div className="table-top">
                <div className="table-summary"> Total Customers: {totalRecords}</div>
                <div>
                    <button className="export-btn" title="Export Customers to Excel" onClick={handleExportCustomers}> {exporting ? "..." : ""}<FileSpreadsheet color="#30c40f" size={24} strokeWidth={2} /></button>
                    <button className="refresh-btn" onClick={resetFilters}> <RefreshCcw color="#2563EB" size={24} strokeWidth={2} /> </button>
                </div>
            </div>
            <div className="table-wrapper">
                <table className="customer-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Plan</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableLoading ? (
                            <tr>
                                <td colSpan="6" className="table-loader">
                                    <Loader />
                                </td>
                            </tr>
                        ) : customers.length === 0 ? (<tr>
                            <td colSpan="6">
                                <EmptyState title="No Customer Found" description="There is no data to display in this table at the moment. New entries will appear here automatically." />
                            </td>
                        </tr>
                        ) : customers.map((customer) => (
                            <tr key={customer.id} className="clickable-row" onClick={() => handleViewCustomer(customer)}>
                                <td data-label="Name">{customer.name}</td>
                                <td data-label="Phone">{customer.phone}</td>
                                <td data-label="Plan"><span className={`plan-badge ${(customer.planName ?? "unassigned").toLowerCase()}`}>{customer.planName ?? "—"}</span></td>
                                <td data-label="Expiry Date">{formatDate(customer.expiryDate)}</td>
                                <td data-label="Status"><span className={`status-badge ${getMembershipStatus(customer).className.toLowerCase()}`}>{getMembershipStatus(customer).text}</span></td>
                                <td data-label="Action">
                                    <div className="icon-btn">
                                        <button className="delete-icn" onClick={(e) => { e.stopPropagation(); handleDeleteClick(customer.id) }}> <Trash2 size={24} /> </button>
                                    </div>
                                </td>
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
            {/* Add Customer Modal */}
            {showAddModal && (<FormModal title="Add Customer" onClose={() => { resetCustomerForm(); setShowAddModal(false) }} loading={saving} onSubmit={handleAddCustomer} buttonText="Save">
                <input type="text" name="name" placeholder="Name" maxLength={50} className="search-input" value={customerForm.name} onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" maxLength={50} className="search-input" value={customerForm.email} onChange={handleChange} />
                <input type="text" name="phone" placeholder="Phone" maxLength={12} className="search-input" value={customerForm.phone} onChange={handleChange} />
                <DatePicker selected={customerForm.joinDate ? new Date(customerForm.joinDate) : null} onChange={(date) => setCustomerForm({ ...customerForm, joinDate: date?.toISOString().split("T")[0] })} dateFormat="yyyy-MM-dd" className="custom-date-picker" placeholderText="Join Date" />
                <select name="planId" value={customerForm.planId} className="filter-select-modal" onChange={handleChange}>
                    <option value="">Select Plan</option>
                    {plans.map((plan) => (<option key={plan.id} value={plan.id}>{plan.name}</option>))}
                </select>
                <p className="readonly-note"> Expiry date will be automatically calculated based on the selected plan.</p>
                <select value={customerForm.paymentMode} onChange={(e) => setCustomerForm({ ...customerForm, paymentMode: e.target.value })} className="filter-select-modal">
                    <option value={PAYMENT_MODE.UPI}> UPI</option>
                    <option value={PAYMENT_MODE.CASH}>Cash</option>
                    <option value={PAYMENT_MODE.CARD}>Card</option>
                    <option value={PAYMENT_MODE.BANK_TRANSFER}>Bank Transfer</option>
                </select>
                <select value={customerForm.paymentStatus} onChange={(e) => setCustomerForm({ ...customerForm, paymentStatus: e.target.value })} className="filter-select-modal">
                    <option value={PAYMENT_STATUS.PAID}>Paid</option>
                    <option value={PAYMENT_STATUS.PENDING}>Pending</option>
                    <option value={PAYMENT_STATUS.FAILED}>Failed</option>
                </select>
                <input type="text" placeholder="Enter Remarks" className="search-input" value={customerForm.paymentRemarks} onChange={(e) => setCustomerForm({ ...customerForm, paymentRemarks: e.target.value })} />
                <select name="status" value={customerForm.status} className="filter-select-modal" onChange={handleChange}>
                    <option value={CUSTOMER_STATUS.ACTIVE}>ACTIVE</option>
                    <option value={CUSTOMER_STATUS.INACTIVE}>INACTIVE</option>
                </select>
            </FormModal>
            )}
            {/*Delete Customer Model */}
            {showDeleteModal && (<ConfirmModal title="Delete Customer" description="Are you sure you want to delete this customer?" onClose={() => setShowDeleteModal(false)} onConfirm={deleteCustomer} loading={deleting} />)}
        </AdminLayout>
    );
}