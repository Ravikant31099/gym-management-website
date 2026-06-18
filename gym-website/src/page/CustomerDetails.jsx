import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { APP_CONFIG, CUSTOMER_STATUS } from "../constants/AppConstants";
import AdminLayout from "../components/layout/AdminLayout";
import { apiRequest, handleApiResponse } from "../util/api";
import { formatDate, formatDateTime } from "../util/CommonUtil";
import { ViewModal, FormModal } from "../components/modals/index";
import { Loader, EmptyState } from "../components/common";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
export default function CustomerDetails() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [customerForm, setCustomerForm] = useState({ name: "", email: "", phone: "", joinDate: "", expiryDate: "", status: "ACTIVE", planId: "" });
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [plans, setPlans] = useState([]);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [showRenewModal, setShowRenewModal] = useState(false);
    const [renewingCustomerId, setRenewingCustomerId] = useState(null);
    const [renewPlanId, setRenewPlanId] = useState("");
    const [activities, setActivities] = useState([]);
    const BASE_URL = import.meta.env.VITE_API_LOCALURL;

    useEffect(() => { fetchCustomerDetails(); fetchCustomerActivities(); }, [id]);
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
    const fetchCustomerActivities = async () => {
        try {
            setLoading(true);
            const response = await apiRequest(`/api/customers/${id}/activities`);
            await handleApiResponse(response);
            const data = await response.json();
            setActivities(data);
        } catch (error) {
            console.log(error);
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
            setShowEditModal(false);
            fetchCustomerDetails();
            fetchCustomerActivities();
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
    const uploadCustomerImage = async () => {
        if (!selectedImage) {
            toast.error("Please select an image");
            return;
        }
        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append("file", selectedImage);
            const token = sessionStorage.getItem("token");
            const response = await fetch(`${BASE_URL}/api/customers/${customer.id}/upload-image`,
                { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: formData });
            await handleApiResponse(response);
            toast.success("Profile image uploaded successfully");
            setSelectedImage(null);
            setShowImageModal(false);
            fetchCustomerDetails();
            fetchCustomerActivities();
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setUploadingImage(false);
        }
    };
    const closeImageModal = () => {
        setSelectedImage(null);
        setShowImageModal(false);
    };
    const openRenewModal = (customer) => {
        setRenewingCustomerId(customer.id);
        setRenewPlanId(customer.planId);
        setShowRenewModal(true);
    };
    const renewMembership = async () => {
        try {
            setUpdating(true);
            const response = await apiRequest(`/api/customers/${renewingCustomerId}/renew`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ planId: renewPlanId })
            }
            );
            await handleApiResponse(response);
            await response.json();
            toast.success("Membership renewed successfully");
            setShowRenewModal(false);
            setRenewingCustomerId(null);
            fetchCustomerDetails();
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong"
            );
        } finally {
            setUpdating(false);
        }
    };
    if (loading) {
        return (
            <AdminLayout>
                <Loader />
            </AdminLayout>
        );
    }
    if (!customer) {
        return (
            <AdminLayout>
                <EmptyState title="Customer Not Found" description="The requested customer does not exist or has been deleted." />
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
                    {customer.profileImageUrl ? (<img src={`http://localhost:8080${customer.profileImageUrl}`} alt={customer.name} className="customer-profile-image" />) : (<div className="customer-profile-placeholder">     {customer.name?.charAt(0).toUpperCase()} </div>)}
                    <div className="profile-info">
                        <h1>{customer.name}</h1>
                        <p className="customer-id">Customer ID : #{customer.id}</p>
                        <div className="profile-badges">
                            <span className={`status-badge-det ${customer.status.toLowerCase()}`}>{customer.status}</span>
                            <span className="plan-badge-det">{customer.planName}
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
                <div className="details-card activity-card">
                    <h3>Customer Activity</h3>{activities.length === 0 ? (<p>No activity found</p>) : (activities.map(activity => (
                        <div key={activity.createdAt} className="activity-item">
                            <div className="activity-dot"></div>
                            <div className="activity-Context">
                                <strong>Activity: {activity.description}</strong>
                                <p> Performed By: {activity.performedBy}</p>
                                <p> Date: {formatDateTime(activity.createdAt)}</p>
                            </div>
                        </div>
                    )))}
                </div>
                <div className="details-actions">
                    <button className="success-btn" onClick={() => openRenewModal(customer)}> Renew Member </button>
                    <button className="primary-btn" onClick={() => setShowImageModal(true)}> Upload Image</button>
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
            {/* Upload Customer Image Model */}
            {showImageModal && (<FormModal title="Upload Customer Image" onClose={closeImageModal} onSubmit={uploadCustomerImage} loading={uploadingImage} buttonText="Upload">
                <input type="file" accept="image/*" className="inputFile" onChange={(e) => setSelectedImage(e.target.files[0])} />
                {selectedImage && (<img src={URL.createObjectURL(selectedImage)} alt="Preview" className="image-preview" />)}
            </FormModal>
            )}
            {/* Renew Membership Modal */}
            {showRenewModal && (<FormModal title="Renew Membership" onClose={() => setShowRenewModal(false)} onSubmit={renewMembership} loading={updating} buttonText="Renew">
                <div className="form-group">
                    <div className="table-summary">Current Plan: <strong>{customer.planName}</strong></div>
                    <select value={renewPlanId} className="filter-select-modal" onChange={(e) => setRenewPlanId(e.target.value)}>
                        {plans.map(plan => (
                            <option key={plan.id} value={plan.id}>{plan.name}</option>))
                        }
                    </select>
                </div>
            </FormModal>
            )}
        </AdminLayout>
    );
}