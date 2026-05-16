import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../style/Admin.css";

export default function Admin() {
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const [selectedLead, setSelectedLead] = useState(null);
    const [statusFilter, setStatusFilter] = useState("ALL");

    const statusOptions = [
        "NEW",
        "CONTACTED",
        "FOLLOW-UP",
        "JOINED",
        "NOT INTERESTED"
    ];

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
        fetch("http://localhost:8080/api/leads")
            .then((response) => response.json())
            .then((data) => setLeads(data))
            .catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showModal]);

    const confirmDelete = () => {
        deleteLead(selectedLeadId);
        setShowModal(false);
        setSelectedLeadId(null);
    };

    const deleteLead = async (id) => {
        try {
            await fetch(`http://localhost:8080/api/leads/${id}`, {
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
            const response = await fetch(
                `http://localhost:8080/api/leads/${id}/status?status=${status}`,
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

            <div className="sidebar">

                <h2 className="logo">
                    FitZone Admin
                </h2>

                <div className="sidebar-menu">
                    <SidebarItem title="Dashboard" />
                    <SidebarItem title="Leads" />
                    <SidebarItem title="Analytics" />
                    <SidebarItem title="Settings" />
                </div>

            </div>

            {/* MAIN */}

            <div className="main-content">

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
                                                onClick={() => {
                                                    setSelectedLead(lead);
                                                    setShowModal(true);
                                                }}
                                            >
                                                View
                                            </button>

                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteLead(lead.id)
                                                }
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

            {showModal && selectedLead && (

                <div className="modal-overlay">

                    <div className="modal-box">

                        <button
                            className="close-btn"
                            onClick={() => setShowModal(false)}
                        >
                            X
                        </button>

                        <h2 className="modal-title">
                            Lead Details
                        </h2>

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

            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="dark"
            />

        </div>
    );
}