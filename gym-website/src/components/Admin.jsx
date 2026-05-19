import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "../style/Admin.css";
export default function Admin() {
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState("");
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [selectedLead, setSelectedLead] = useState(null);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const statusOptions = [
        "NEW",
        "CONTACTED",
        "FOLLOW-UP",
        "JOINED",
        "NOT INTERESTED"
    ];
    const navigate = useNavigate();
    const pending = leads.filter(
        (lead) => lead.status === "NEW"
    ).length;
    const joinedLeads = leads.filter(
        (lead) => lead.status === "JOINED"
    ).length;
    const contactedLeads = leads.filter(
        (lead) => lead.status === "CONTACTED"
    ).length;
    const followUpLeads = leads.filter(
        (lead) => lead.status === "FOLLOW-UP"
    ).length;
    const chartData = [
        {
            name: "New",
            value: leads.filter((lead) => lead.status === "NEW").length
        },
        {
            name: "Contacted",
            value: leads.filter((lead) => lead.status === "CONTACTED").length
        },
        {
            name: "Closed",
            value: leads.filter((lead) => lead.status === "CLOSED").length
        }
    ];
    const filteredLeads = leads.filter((lead) => {
        const matchesSearch =
            lead.name.toLowerCase().includes(search.toLowerCase()) ||
            lead.email.toLowerCase().includes(search.toLowerCase()) ||
            lead.phone.includes(search);
        const matchesStatus =
            statusFilter === "ALL" ||
            lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    useEffect(() => {
        apiRequest("/api/leads")
            .then((response) => response.json())
            .then((data) => setLeads(data))
            .catch((error) => console.log(error));
    }, []);
    useEffect(() => {
        const isAnyModalOpen = showViewModal || showDeleteModal;
        document.body.style.overflow = isAnyModalOpen ? "hidden" : "auto";
    }, [showViewModal, showDeleteModal]);
    const openViewModal = (lead) => {
        setSelectedLead(lead);
        setShowViewModal(true);
    };
    const openDeleteModal = (id) => {
        setSelectedLeadId(id);
        setShowDeleteModal(true);
    };
    const confirmDelete = () => {
        deleteLead(selectedLeadId);
        setShowDeleteModal(false);
        setSelectedLeadId(null);
    };
    const deleteLead = async (id) => {
        try {
            await apiRequest(`/api/leads/${id}`, {
                method: "DELETE"
            });
            setLeads(leads.filter((lead) => lead.id !== id));
            toast.success("Lead deleted successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete lead");
        }
    };
    const updateStatus = async (id, status) => {
        try {
            const response = await apiRequest(
                `/api/leads/${id}/status?status=${status}`,
                {
                    method: "PUT"
                }
            );
            const updatedLead = await response.json();
            setLeads(
                leads.map((lead) =>
                    lead.id === id ? updatedLead : lead
                )
            );
        } catch (error) {
            console.log(error);
        }
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };
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
    function SidebarItem({ title }) {
        return (
            <div className="sidebar-item">
                {title}
            </div>
        );
    }
    function DetailItem({ label, value }) {
        return (
            <div className="detail-item">
                <p className="detail-label">{label}</p>
                <p className="detail-value">{value}</p>
            </div>
        );
    }
    return (
        <div className="admin-container">
            {/* SIDEBAR */}
            {isSidebarOpen && (
                <div
                    className="modal-overlay"
                    style={{ zIndex: 1999 }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="logo">FitZone Admin</div>
                <div className="sidebar-menu">
                    <div className="sidebar-item active">Dashboard</div>
                    <div className="sidebar-item">Leads Management</div>
                    <div className="sidebar-item">Analytics</div>
                </div>
                <div class="logout-wrapper">
                    <button class="btn-logout" onClick={handleLogout}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>
            <div className="main-content">
                <button
                    className="mobile-nav-toggle"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    type="button"
                >
                    ☰ {isSidebarOpen ? 'Close Menu' : 'Open Menu'}
                </button>
                {/* HEADER */}
                <div className="header-card">
                    <div>
                        <p className="admin-label">
                            ADMIN PANEL
                        </p>
                        <h1 className="dashboard-title">
                            Dashboard Overview
                        </h1>
                        <p className="dashboard-subtitle">
                            Manage customer inquiries and business leads
                        </p>
                    </div>
                    <div className="admin-badge">
                        <div className="badge-dot" />
                        <span>
                            FitZone Admin
                        </span>
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
                {/* CHARTS */}
                <div className="charts-grid">
                    <div className="chart-card">
                        <h2>Leads Analytics</h2>
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip />
                                <Bar
                                    dataKey="value"
                                    fill="#22c55e"
                                    radius={[10, 10, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="chart-card">
                        <h2>Lead Distribution</h2>
                        <ResponsiveContainer width="100%" height="85%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    outerRadius={100}
                                    label
                                >
                                    <Cell fill="#22c55e" />
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#ef4444" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* SEARCH */}
                <div className="search-filter-container">
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="search-input"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                        className="filter-select"
                    >
                        <option value="ALL">All Status</option>
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
                {/* TABLE */}
                <div className="table-wrapper">
                    <table className="leads-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Subject</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map((lead, index) => (
                                <tr
                                    key={lead.id}
                                    className={
                                        index % 2 === 0
                                            ? "row-even"
                                            : "row-odd"
                                    }
                                >
                                    <td>{lead.name}</td>
                                    <td>{lead.email}</td>
                                    <td>{lead.phone}</td>
                                    <td>{lead.subject}</td>
                                    <td
                                        title={lead.message}
                                        className="message-cell"
                                    >
                                        {lead.message}
                                    </td>
                                    <td>
                                        <select
                                            value={lead.status || "NEW"}
                                            onChange={(e) =>
                                                updateStatus(
                                                    lead.id,
                                                    e.target.value
                                                )
                                            }
                                            className="status-select"
                                        >
                                            {statusOptions.map((status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                className="view-btn"
                                                onClick={() => openViewModal(lead)}
                                            >
                                                View
                                            </button>
                                            <button
                                                className="delete-btn"
                                                onClick={() => openDeleteModal(lead.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* VIEW MODAL */}
            {showViewModal && selectedLead && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <button className="close-btn" onClick={() => setShowViewModal(false)}> X
                        </button>
                        <h2 className="modal-title"> Lead Details</h2>
                        <div className="modal-grid">
                            <DetailItem
                                label="Name"
                                value={selectedLead.name}
                            />
                            <DetailItem
                                label="Email"
                                value={selectedLead.email}
                            />
                            <DetailItem
                                label="Phone"
                                value={selectedLead.phone}
                            />
                            <DetailItem
                                label="Subject"
                                value={selectedLead.subject}
                            />
                            <DetailItem
                                label="Status"
                                value={selectedLead.status}
                            />
                            <DetailItem
                                label="Message"
                                value={selectedLead.message}
                            />
                        </div>
                    </div>
                </div>
            )}
            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="confirm-modal-box" onClick={(e) => e.stopPropagation()}>
                        <h2 className="confirm-modal-title">Delete Lead</h2>
                        <p className="confirm-modal-desc">
                            Are you sure you want to permanently delete this lead? This action cannot be undone.
                        </p>
                        <div className="confirm-modal-actions">
                            <button
                                className="confirm-btn-cancel"
                                onClick={() => setShowDeleteModal(false)}
                                type="button"
                            > Cancel
                            </button>
                            <button
                                className="confirm-btn-danger"
                                onClick={confirmDelete}
                                type="button"
                            > Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="dark"
            />
        </div>
    );
}