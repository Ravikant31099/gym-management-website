import { useNavigate, useLocation } from "react-router-dom";
import "../../style/Admin.css";
import { clearToken } from "../../util/AuthUtils";

export default function AdminSidebar({ isSidebarOpen, setIsSidebarOpen, scrollToTop, scrollToSection, leadsRef, analyticsRef}) {
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => { clearToken(); navigate("/login");};
    return (
        <main>
            {isSidebarOpen && (<div className="modal-overlay" style={{ zIndex: 1999 }} onClick={() => setIsSidebarOpen(false)} />)}
            <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <div className="sidebar-header">FitZone Admin </div>
                <div className="sidebar-menu">
                    <div className={`sidebar-item ${location.pathname === "/admin" ? "active" : ""}`} onClick={() => { navigate("/admin") }}> Dashboard</div>
                    <div className={`sidebar-item ${location.pathname === "/admin/leads" ? "active" : ""}`} onClick={() => navigate("/admin/leads")}> Leads Management</div>
                    <div className={`sidebar-item ${location.pathname === "/admin/customers" ? "active" : ""}`} onClick={() => navigate("/admin/customers")}> Customer Management</div>
                    <div className={`sidebar-item ${location.pathname === "/admin/payments" ? "active" : ""}`} onClick={() => navigate("/admin/payments")}> Payment Management</div>
                    <div className={`sidebar-item ${location.pathname === "/admin/leads/analytics" ? "active" : ""}`} onClick={() => navigate("/admin/leads/analytics")}> Lead Analytics</div>
                    <div className={`sidebar-item ${location.pathname === "/admin/customers/analytics" ? "active" : ""}`} onClick={() => navigate("/admin/customers/analytics")}> Customer Analytics</div>
                    <div className={`sidebar-item ${location.pathname === "/admin/payments/analytics" ? "active" : ""}`} onClick={() => navigate("/admin/payments/analytics")}> Payment Analytics</div>
                    <div className={`sidebar-item ${location.pathname === "/admin/plans" ? "active" : ""}`} onClick={() => navigate("/admin/plans")}> Plan Management</div>
                </div>
                <div className="logout-wrapper">
                    <button className="btn-logout" onClick={handleLogout}> Logout</button>
                </div>
            </aside>
        </main>
    );
}