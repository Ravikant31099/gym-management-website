import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../style/Admin.css";
import { apiRequest } from "../util/api";
import AdminSidebar from "../components/AdminSidebar";
import AdminLayout from "../components/Layout/AdminLayout";

export default function Admin() {
    const [leads, setLeads] = useState([]);
    const [customerStats, setCustomerStats] = useState({ total: 0, active: 0, expiring: 0, expired: 0 });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const pending = leads.filter((lead) => lead.status === "NEW").length;
    const joinedLeads = leads.filter((lead) => lead.status === "JOINED").length;
    const contactedLeads = leads.filter((lead) => lead.status === "CONTACTED").length;
    const followUpLeads = leads.filter((lead) => lead.status === "FOLLOW-UP").length;
    useEffect(() => { apiRequest("/api/leads").then((response) => response.json()).then((data) => setLeads(data)).catch((error) => console.log(error)); }, []);
    useEffect(() => { fetchCustomerStats(); }, []);
    const fetchCustomerStats = async () => {
        try {
            const response = await apiRequest("/api/customers");
            if (!response.ok) {
                return;
            }
            const customers = await response.json();
            const today = new Date();
            let active = 0;
            let expiring = 0;
            let expired = 0;
            customers.forEach(customer => {
                const expiry = new Date(customer.expiryDate);
                const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
                if (diffDays < 0) {
                    expired++;
                } else if (diffDays <= 7) {
                    expiring++;
                } else {
                    active++;
                }
            });
            setCustomerStats({ total: customers.length, active, expiring, expired });
        } catch (error) {
            console.log(error);
        }
    };
    function DashboardCard({ title, value, color, onClick }) {
        return (
            <div className="dashboard-card" onClick={onClick}>
                <div
                    className="dashboard-circle"
                    style={{ background: color }}
                />
                <h3>{title}</h3>
                <h1>{value}</h1>
                <p style={{ color }}>Live Data</p>
            </div>
        );
    }
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    function SidebarItem({ title }) {
        return (
            <div className="sidebar-item">
                {title}
            </div>
        );
    }
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
                    <DashboardCard title="Expiring Soon" value={customerStats.expiring} color="#f59e0b" onClick={() => navigate("/admin/customers/analytics")} />
                    <DashboardCard title="Expired Members" value={customerStats.expired} color="#ef4444" onClick={() => navigate("/admin/customers/analytics")} />
                </div>
            </div>
        </AdminLayout>
    );
}