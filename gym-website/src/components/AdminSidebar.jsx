import { useNavigate } from "react-router-dom";
import "../style/Admin.css";

export default function AdminSidebar({
    isSidebarOpen,
    setIsSidebarOpen,
    scrollToTop,
    scrollToSection,
    leadsRef,
    analyticsRef
}) {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };
    return (
        <>
            {isSidebarOpen && (
                <div
                    className="modal-overlay"
                    style={{ zIndex: 1999 }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <div className="sidebar-header">FitZone Admin </div>
                <div className="sidebar-menu">
                    <div className="sidebar-item active"
                        onClick={scrollToTop}
                    > Dashboard
                    </div>
                    <div className="sidebar-item"
                        onClick={() => scrollToSection(leadsRef)}
                    > Leads Management
                    </div>
                    <div className="sidebar-item"
                        onClick={() => scrollToSection(analyticsRef)}
                    > Analytics
                    </div>
                    <div className="sidebar-item"
                        onClick={() => navigate("/admin/plans")}
                    > Plan Management
                    </div>
                </div>
                <div className="logout-wrapper">
                    <button className="btn-logout"
                        onClick={handleLogout}
                    > Logout
                    </button>
                </div>
            </aside>
        </>
    );
}