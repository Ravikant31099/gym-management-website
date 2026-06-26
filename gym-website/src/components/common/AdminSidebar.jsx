import "../../style/Admin.css";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { clearToken } from "../../util/AuthUtils";
import gymLogo from "../../assets/gym-logo.png";
import { LayoutDashboard, UserCheck, Users, CreditCard, ChevronDown, ChevronUp, Layers, LogOut } from 'lucide-react';

export default function AdminSidebar({ isSidebarOpen, setIsSidebarOpen, scrollToTop, scrollToSection, leadsRef, analyticsRef }) {
    const navigate = useNavigate();
    const location = useLocation();
    const handleLogout = () => { clearToken(); navigate("/login"); };
    const [openSubmenus, setOpenSubmenus] = useState({ leads: false, customers: false, payments: false, });
    const toggleSubmenu = (menu) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [menu]: !prev[menu]
        }));
    };
    return (
        <main>
            {isSidebarOpen && (<div className="modal-overlay" style={{ zIndex: 1999 }} onClick={() => setIsSidebarOpen(false)} />)}
            <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <div className="brand-logo sidebar-header">
                    <div className="logo">
                        <div className="nav-logo-container">
                            <img src={gymLogo} alt="Gym Logo" className="nav-gym-logo" />
                        </div>
                    </div>
                    <div className="logo-text">
                        <span className="fit">FIT</span><span className="zone">ZONE</span>
                    </div>
                </div>
                <div className="sidebar-menu">
                    <div className={`sidebar-item ${location.pathname === "/admin" ? "active" : ""}`} onClick={() => navigate("/admin")}>
                        <div className="sidebar-item-left">
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </div>
                    </div>
                    <div className="sidebar-group">
                        <div className={`sidebar-item ${location.pathname.startsWith("/admin/customers") ? "parent-active" : ""}`} onClick={() => toggleSubmenu('customers')}>
                            <div className="sidebar-item-left">
                                <Users size={18} />
                                <span>Customers</span>
                            </div>
                            {openSubmenus.customers ? <ChevronUp size={16} className="chevron" /> : <ChevronDown size={16} className="chevron" />}
                        </div>
                        {openSubmenus.customers && (
                            <div className="sidebar-submenu">
                                <div className={`submenu-item ${location.pathname === "/admin/customers" ? "active" : ""}`} onClick={() => navigate("/admin/customers")}>Overview</div>
                                <div className={`submenu-item ${location.pathname === "/admin/customers/analytics" ? "active" : ""}`} onClick={() => navigate("/admin/customers/analytics")}>Customer Analytics</div>
                            </div>
                        )}
                    </div>
                    <div className="sidebar-group">
                        <div className={`sidebar-item ${location.pathname.startsWith("/admin/payments") ? "parent-active" : ""}`} onClick={() => toggleSubmenu('payments')}>
                            <div className="sidebar-item-left">
                                <CreditCard size={18} />
                                <span>Payments</span>
                            </div>
                            {openSubmenus.payments ? <ChevronUp size={16} className="chevron" /> : <ChevronDown size={16} className="chevron" />}
                        </div>
                        {openSubmenus.payments && (
                            <div className="sidebar-submenu">
                                <div className={`submenu-item ${location.pathname === "/admin/payments" ? "active" : ""}`} onClick={() => navigate("/admin/payments")}>Overview</div>
                                <div className={`submenu-item ${location.pathname === "/admin/payments/analytics" ? "active" : ""}`} onClick={() => navigate("/admin/payments/analytics")}>Payment Analytics</div>
                            </div>
                        )}
                    </div>
                    <div className="sidebar-group">
                        <div className={`sidebar-item ${location.pathname.startsWith("/admin/leads") ? "parent-active" : ""}`} onClick={() => toggleSubmenu('leads')}>
                            <div className="sidebar-item-left">
                                <UserCheck size={18} />
                                <span>Leads</span>
                            </div>
                            {openSubmenus.leads ? <ChevronUp size={16} className="chevron" /> : <ChevronDown size={16} className="chevron" />}
                        </div>
                        {openSubmenus.leads && (
                            <div className="sidebar-submenu">
                                <div className={`submenu-item ${location.pathname === "/admin/leads" ? "active" : ""}`} onClick={() => navigate("/admin/leads")}>Overview</div>
                                <div className={`submenu-item ${location.pathname === "/admin/leads/analytics" ? "active" : ""}`} onClick={() => navigate("/admin/leads/analytics")}>Lead Analytics</div>
                            </div>
                        )}
                    </div>
                    <div className={`sidebar-item ${location.pathname === "/admin/plans" ? "active" : ""}`} onClick={() => navigate("/admin/plans")}>
                        <div className="sidebar-item-left">
                            <Layers size={18} />
                            <span>Plans</span>
                        </div>
                    </div>
                </div>
                <div className="logout-wrapper">
                    <button className="btn-logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </main>
    );
}