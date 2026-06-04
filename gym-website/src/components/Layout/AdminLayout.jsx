import AdminSidebar from "../common/AdminSidebar";
import { useState, useEffect } from "react";
import "../../style/Admin.css";

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (
        <div className="admin-container">
            <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="main-content">
                <button className="mobile-nav-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)} type="button">
                    ☰ {isSidebarOpen ? " Close Menu" : " Open Menu"}
                </button> {children}
            </div>
        </div>
    );
}