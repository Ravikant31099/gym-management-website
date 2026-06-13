import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../components/layout/AdminLayout";
import { apiRequest, handleApiResponse } from "../util/api";
import { formatDate, formatDateTime } from "../util/CommonUtil";

export default function CustomerDetails() {
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchCustomerDetails();
    }, [id]);
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
                        <div className="profile-badges">
                            <span className={`status-badge ${customer.status.toLowerCase()}`}>{customer.status}</span>
                            <span className="plan-badge">{customer.planName}
                            </span>
                        </div>
                    </div>
                </div>
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
                        <strong className={customer.daysRemaining <= 0 ? "text-danger" : customer.daysRemaining <= 7 ? "text-warning" : "text-success"}>{customer.daysRemaining}
                        </strong>
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
                        <strong>{formatDateTime(customer.imageUpdatedAt) || "-"}</strong>
                    </div>
                </div>
                <div className="details-actions">
                    <button className="primary-btn"> Upload Image</button>
                    <button className="secondary-btn">Edit Customer</button>
                </div>
            </div>
        </AdminLayout>
    );
}