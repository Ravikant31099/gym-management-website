import "../style/Admin.css";
import { Component, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, handleApiResponse } from "../util/api";
import { AdminSidebar, DashboardCard, EmptyState } from "../components/common/index";
import { toast } from "react-toastify";
import { formatDate } from "../util/CommonUtil";
import AdminLayout from "../components/layout/AdminLayout";

export default function Admin() {
    const [customerStats, setCustomerStats] = useState([]);
    const [expiringCustomers, setExpiringCustomers] = useState([]);
    const navigate = useNavigate();
    useEffect(() => { fetchCustomerStats(); fetchExpiringCustomers(); }, []);

    const fetchCustomerStats = async () => {
        try {
            const response = await apiRequest("/api/customers/stats");
            await handleApiResponse(response);
            const stats = await response.json();
            setCustomerStats({
                total: stats.totalCustomers,
                active: stats.activeCustomers,
                inactive: stats.inactiveCustomers,
                expiringToday: stats.expiringToday,
                expiring: stats.expiringCustomers,
                expired: stats.expiredCustomers,
                newCustomers: stats.newCustomersThisMonth,
                renewals: stats.renewalsThisMonth
            });
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    const fetchExpiringCustomers = async () => {
        try {
            const response = await apiRequest("/api/customers/expiring-soon");
            await handleApiResponse(response);
            const data = await response.json();
            setExpiringCustomers(data);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    return (
        <AdminLayout>
            {/* HEADER */}
            <div className="header-card">
                <div>
                    <p className="admin-label">ADMIN PANEL</p>
                    <h1 className="dashboard-title"> Dashboard Overview</h1>
                    <p className="dashboard-subtitle">Overview of your gym's performance</p>
                </div>
                <div className="admin-badge">
                    <div className="badge-dot" />
                    <span> FitZone Admin</span>
                </div>
            </div>
            {/* Customer Summary */}
            <div className="dashboard-section">
                <h3 className="cards-header"> Customer Summary </h3>
                <div className="cards-grid">
                    <DashboardCard title="Total Customers" value={customerStats?.total} color="#22c55e" onClick={() => navigate("/admin/customers/analytics")} />
                    <DashboardCard title="Active Members" value={customerStats?.active} color="#72d327" onClick={() => navigate("/admin/customers/analytics")} />
                    <DashboardCard title="Expiring Soon" value={customerStats.expiring} color="#f59e0b" onClick={() => navigate("/admin/customers/analytics")} />
                    <DashboardCard title="Expiring Today" value={customerStats?.expiringToday} color="#f90000" onClick={() => navigate("/admin/customers/analytics")} />
                    <DashboardCard title="Inactive Members" value={customerStats.inactive} color="#ef4444" onClick={() => navigate("/admin/customers/analytics")} />
                    <DashboardCard title="Expired Members" value={customerStats?.expired} color="#f40404" onClick={() => navigate("/admin/customers/analytics")} />
                    <DashboardCard title="New Customers" value={customerStats?.newCustomers} color="#2fce20" onClick={() => navigate("/admin/customers/analytics")} />
                    <DashboardCard title="Renewed Customers" value={customerStats?.renewals} color="#55de2f" onClick={() => navigate("/admin/customers/analytics")} />
                </div>
                <table className="dash-table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Phone</th>
                            <th>Plan</th>
                            <th>Expiry Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expiringCustomers.length === 0 ? (<tr>
                            <td colSpan="8">
                                <EmptyState title="No Customer Found" description="There is no data to display in this table at the moment. New entries will appear here automatically." />
                            </td>
                        </tr>
                        ) : expiringCustomers.map(customer => (
                            <tr key={customer.id} className="table-row">
                                <td className="customer-name">{customer.name}</td>
                                <td className="phone-number">{customer.phone}</td>
                                <td><span className="plan-badge-dash">{customer.planName}</span></td>
                                <td className="expiry-date">{formatDate(customer.expiryDate)}</td>
                                <td><span className={`status-badge ${customer.daysRemaining <= 3 ? 'urgent' : 'warning'}`}>    {customer.daysRemaining} days left</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}