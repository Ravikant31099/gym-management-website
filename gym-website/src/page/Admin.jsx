import "../style/Admin.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, handleApiResponse } from "../util/api";
import { AdminSidebar, DashboardCard } from "../components/common/index";
import AdminLayout from "../components/layout/AdminLayout";
import { toast } from "react-toastify";

export default function Admin() {
    const [leads, setLeads] = useState([]);
    const [customerStats, setCustomerStats] = useState({ total: 0, inactive: 0, active: 0, expiring: 0, expired: 0 });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const pending = leads.filter((lead) => lead.status === "NEW").length;
    const joinedLeads = leads.filter((lead) => lead.status === "JOINED").length;
    const contactedLeads = leads.filter((lead) => lead.status === "CONTACTED").length;
    const followUpLeads = leads.filter((lead) => lead.status === "FOLLOW-UP").length;
    useEffect(() => { fetchLeadStats(); fetchCustomerStats(); }, []);
    const fetchLeadStats = async () => {
        try {
            const response = await apiRequest("/api/leads");
            await handleApiResponse(response);
            const data = await response.json();
            setLeads(data);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    const fetchCustomerStats = async () => {
        try {
            const response = await apiRequest("/api/customers/stats");
            await handleApiResponse(response);
            const stats = await response.json();
            setCustomerStats({
                total: stats.totalCustomers,
                active: stats.activeCustomers,
                inactive: stats.inactiveCustomers,
                expiring: stats.expiringCustomers,
                expired: stats.expiredCustomers
            });
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
            {/* CARDS */}
            <div className="dashboard-section">
                <h3 className="cards-header"> Lead Summary </h3>
                <div className="cards-grid">
                    <DashboardCard title="Joined" value={joinedLeads} color="#22c55e" onClick={() => navigate("/admin/leads/analytics")} />
                    <DashboardCard title="Follow-Up" value={followUpLeads} color="#3b82f6" onClick={() => navigate("/admin/leads/analytics")} />
                    <DashboardCard title="Contacted" value={contactedLeads} color="#f59e0b" onClick={() => navigate("/admin/leads/analytics")} />
                    <DashboardCard title="Pending" value={pending} color="#ef4444" onClick={() => navigate("/admin/leads/analytics")} />
                </div>
            </div>
            <div className="dashboard-section">
                <h3 className="cards-header"> Customer Summary </h3>
                <div className="cards-grid">
                    <DashboardCard title="Total Customers" value={customerStats.total} color="#22c55e" onClick={() => navigate("/admin/customers/analytics")} />
                    <DashboardCard title="Active Members" value={customerStats.active} color="#3b82f6" onClick={() => navigate("/admin/customers/analytics")} />
                    <DashboardCard title="Inactive Members" value={customerStats.inactive} color="#ef4444" onClick={() => navigate("/admin/customers/analytics")} />
                    <DashboardCard title="Expiring Soon" value={customerStats.expiring} color="#f59e0b" onClick={() => navigate("/admin/customers/analytics")} />
                    <DashboardCard title="Expired Members" value={customerStats.expired} color="#cd5e2b" onClick={() => navigate("/admin/customers/analytics")} />
                </div>
            </div>
        </AdminLayout>
    );
}