import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { APP_CONFIG, CUSTOMER_STATUS } from "../constants/AppConstants";
import AdminLayout from "../components/layout/AdminLayout";
import { apiRequest, handleApiResponse } from "../util/api";
import { formatDate, formatDateTime } from "../util/CommonUtil";
import { ViewModal, FormModal } from "../components/modals/index";
import DatePicker from "react-datepicker";

export default function CustomerDetails() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [customerForm, setCustomerForm] = useState({ name: "", email: "", phone: "", joinDate: "", expiryDate: "", status: "ACTIVE", planId: "" });
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [plans, setPlans] = useState([]);
    useEffect(() => { fetchCustomerDetails(); }, [id]);
    useEffect(() => { fetchPlansForCustomer(); }, []);
    const fetchCustomerDetails = async () => {
        try {
            setLoading(true);
            const response = await apiRequest(`/api/customers/${id}`);
            await handleApiResponse(response);
            const data = await response.json();
            setCustomer(data);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    const fetchPlansForCustomer = async () => {
        try {
            setLoading(true);
            const response = await apiRequest("/api/plans", "GET");
            await handleApiResponse(response);
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    const openEditCustomer = (customer) => {
        setSelectedCustomer(customer);
        setCustomerForm({ name: customer.name, email: customer.email, phone: customer.phone, joinDate: customer.joinDate, expiryDate: customer.expiryDate, status: customer.status, planId: customer.planId });
        setShowEditModal(true);
    };
    const handleUpdateCustomer = async () => {
        setUpdating(true);
        if (!validateForm()) {
            setUpdating(false);
            return;
        }
        try {
            const response = await apiRequest(`/api/customers/${selectedCustomer.id}`, { method: "PUT", body: JSON.stringify(customerForm) });
            await handleApiResponse(response);
            await response.json();
            toast.success("Customer Updated Successfully");
            setTimeout(() => {
                setShowEditModal(false);
                fetchCustomerDetails();
            }, 1000);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setUpdating(false);
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
        if (!customerForm.expiryDate) {
            toast.error("Expiry date required");
            return false;
        }
        if (!customerForm.planId) {
            toast.error("Select a plan");
            return false;
        }
        return true;
    };
    const handleChange = (e) => {
        setCustomerForm({ ...customerForm, [e.target.name]: e.target.value });
    };
    if (loading) {
        return (
            <AdminLayout>
                <p>Loading...</p>
            </AdminLayout>
        );
    }
    if (!customer) {
        return (
            <AdminLayout>
                <p>Customer not found</p>
            </AdminLayout>
        );
    }
    return (
        <AdminLayout>
            <div className="header-card">
                <div>
                    <p className="admin-label"> ADMIN PANEL</p>
                    <h1 className="dashboard-title">Customer Overview</h1>
                    <p className="dashboard-subtitle"> View and manage customer details </p>
                </div>
                <div className="admin-badge">
                    <div className="badge-dot" />
                    <span> FitZone Admin</span>
                </div>
            </div>
            <div className="customer-details-container">
                <div className="customer-profile-card">
                    <img src={customer.profileImageUrl ? `http://localhost:8080${customer.profileImageUrl}` : "/default-avatar.png"} alt={customer.name} className="customer-profile-image" />
                    <div className="profile-info">
                        <h1>{customer.name}</h1>
                        <p className="customer-id">Customer ID : #{customer.id}</p>
                        <div className="profile-badges">
                            <span className={`status-badge ${customer.status.toLowerCase()}`}>{customer.status}</span>
                            <span className="plan-badge">{customer.planName}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="customer-details-grid">
                    <div className="details-card">
                        <h3>Customer Information</h3>
                        <div className="details-row">
                            <span>Phone</span>
                            <strong>{customer.phone}</strong>
                        </div>
                        <div className="details-row">
                            <span>Email</span>
                            <strong>{customer.email}</strong>
                        </div>
                        <div className="details-row">
                            <span>Join Date</span>
                            <strong>{formatDate(customer.joinDate)}</strong>
                        </div>
                        <div className="details-row">
                            <span>Expiry Date</span>
                            <strong>{formatDate(customer.expiryDate)}</strong>
                        </div>
                    </div>
                    <div className="details-card">
                        <h3>Membership Information</h3>
                        <div className="details-row">
                            <span>Plan</span>
                            <strong>{customer.planName}</strong>
                        </div>
                        <div className="details-row">
                            <span>Status</span>
                            <strong>{customer.status}</strong>
                        </div>
                        <div className="details-row">
                            <span>Days Remaining</span>
                            <strong className={customer.daysRemaining <= 0 ? "text-danger" : customer.daysRemaining <= 7 ? "text-warning" : "text-success"}> {customer.daysRemaining <= 0 ? "Expired" : `${customer.daysRemaining} Days`}</strong>
                        </div>
                    </div>
                    <div className="details-card">
                        <h3>Image Information</h3>
                        <div className="details-row">
                            <span>Updated By</span>
                            <strong> {customer.imageUpdatedBy || "-"}
                            </strong>
                        </div>
                        <div className="details-row">
                            <span>Updated At</span>
                            <strong>{customer.imageUpdatedAt ? formatDateTime(customer.imageUpdatedAt) : "-"}</strong>
                        </div>
                    </div>
                    <div className="details-card">
                        <h3>Membership Health</h3>
                        <div className="details-row">
                            <span>Renewal Risk</span>
                            <strong className={customer.daysRemaining <= 0 ? "text-danger" : customer.daysRemaining <= 7 ? "text-warning" : "text-success"}>{customer.daysRemaining <= 0 ? "High" : customer.daysRemaining <= 7 ? "Medium" : "Low"}</strong>
                        </div>
                        <div className="details-row">
                            <span>Membership Age</span>
                            <strong>{Math.floor((new Date() - new Date(customer.joinDate)) / (1000 * 60 * 60 * 24))} Days</strong>
                        </div>
                        <div className="details-row">
                            <span>Membership Health</span>
                            <strong className={customer.daysRemaining <= 0 ? "text-danger" : customer.daysRemaining <= 7 ? "text-warning" : "text-success"}> {customer.daysRemaining <= 0 ? "Critical" : customer.daysRemaining <= 7 ? "Needs Attention" : "Healthy"}</strong>
                        </div>
                    </div>
                </div>
                <div className="details-actions">
                    <button className="primary-btn"> Upload Image</button>
                    <button className="secondary-btn" onClick={() => openEditCustomer(customer)}>Edit Customer</button>
                </div>
            </div>
            {/* Edit Customer Model */}
            {showEditModal && (<FormModal title="Edit Customer" onClose={() => setShowEditModal(false)} onSubmit={handleUpdateCustomer} loading={updating} buttonText="Update Customer">
                <input type="text" name="name" placeholder="Name" className="search-input" value={customerForm.name} onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" className="search-input" value={customerForm.email} onChange={handleChange} />
                <input type="text" name="phone" placeholder="Phone" className="search-input" value={customerForm.phone} onChange={handleChange} />
                <DatePicker selected={customerForm.joinDate ? new Date(customerForm.joinDate) : null} onChange={(date) => setCustomerForm({ ...customerForm, joinDate: date?.toISOString().split("T")[0] })} dateFormat="yyyy-MM-dd" className="custom-date-picker" placeholderText="Join Date" />
                <DatePicker selected={customerForm.expiryDate ? new Date(customerForm.expiryDate) : null} onChange={(date) => setCustomerForm({ ...customerForm, expiryDate: date?.toISOString().split("T")[0] })} dateFormat="yyyy-MM-dd" className="custom-date-picker" placeholderText="Expiry Date" />
                <select name="planId" value={customerForm.planId} className="filter-select-modal" onChange={handleChange}>
                    <option value="">Select Plan</option>
                    {Array.isArray(plans) && plans.map((plan) => (<option key={plan.id} value={plan.id}>{plan.name}</option>))}
                </select>
                <select name="status" value={customerForm.status} className="filter-select-modal" onChange={handleChange}>
                    <option value={CUSTOMER_STATUS.ACTIVE}> ACTIVE</option>
                    <option value={CUSTOMER_STATUS.INACTIVE}>INACTIVE</option>
                </select>
            </FormModal>
            )}
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </AdminLayout>
    );
}