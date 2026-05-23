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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const pending = leads.filter((lead) => lead.status === "NEW").length;
    const joinedLeads = leads.filter((lead) => lead.status === "JOINED").length;
    const contactedLeads = leads.filter((lead) => lead.status === "CONTACTED").length;
    const followUpLeads = leads.filter((lead) => lead.status === "FOLLOW-UP").length;
    useEffect(() => { apiRequest("/api/leads").then((response) => response.json()).then((data) => setLeads(data)).catch((error) => console.log(error)); }, []);
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
            <div className="cards-grid">
                <DashboardCard
                    title="Joined"
                    value={joinedLeads}
                    color="#22c55e"
                />
                <DashboardCard
                    title="Follow-Up"
                    value={followUpLeads}
                    color="#3b82f6"
                />
                <DashboardCard
                    title="Contacted"
                    value={contactedLeads}
                    color="#f59e0b"
                />
                <DashboardCard
                    title="Pending"
                    value={pending}
                    color="#ef4444"
                />
            </div>
        </AdminLayout>
    );
}