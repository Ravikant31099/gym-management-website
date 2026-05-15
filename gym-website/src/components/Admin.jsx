import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Admin() {
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedLeadId, setSelectedLeadId] = useState(null);
    const totalLeads = leads.length;
    const todayLeads = leads.length;
    const contacted = leads.filter((lead) => lead.status === "CONTACTED").length;
    const pending = leads.filter((lead) => lead.status === "NEW").length;
    const filteredLeads = leads.filter((lead) =>
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.phone.includes(search)
    );
    useEffect(() => {
        fetch("http://localhost:8080/api/leads").then((response) => response.json()).then((data) => setLeads(data))
            .catch((error) => console.log(error));
    }, []);
    const openDeleteModal = (id) => {
        setSelectedLeadId(id);
        setShowModal(true);
    };
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
            const response = await fetch(`http://localhost:8080/api/leads/${id}/status?status=${status}`, {
                method: "PUT"
            }
            );
            const updatedLead = await response.json();
            setLeads(leads.map((lead) => lead.id === id ? updatedLead : lead));
        } catch (error) {
            console.log(error);
        }
    };
    function DashboardCard({ title, value }) {
        return (
            <div style={{
                background: "linear-gradient(135deg, #1e293b, #111827)",
                padding: "30px",
                border: "1px solid #334155",
                borderRadius: "18px",
                textAlign: "left",
                boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
                transition: "0.3s",
                position: "relative",
                overflow: "hidden"
            }}>
                <div style={{
                    position: "absolute",
                    top: "-30px",
                    right: "-30px",
                    width: "100px",
                    height: "100px",
                    background: "rgba(34,197,94,0.08)",
                    borderRadius: "50%"
                }}></div>
                <h3 style={{
                    color: "#94a3b8",
                    marginBottom: "18px",
                    fontSize: "16px",
                    fontWeight: "500"
                }}> {title}
                </h3>
                <h1 style={{
                    fontSize: "42px",
                    color: "#22c55e",
                    fontWeight: "700"
                }}> {value}
                </h1>
            </div>
        );
    }
    function SidebarItem({ title }) {
        return (
            <div style={{
                padding: "16px 18px",
                borderRadius: "14px",
                cursor: "pointer",
                transition: "0.3s",
                background: "#1e293b",
                border: "1px solid #334155",
                fontWeight: "600",
                fontSize: "15px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)"
            }}>{title}
            </div>
        );
    }
    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            background: "#0f172a",
            color: "white",
            overflow: "hidden"
        }}>
            {/* SIDEBAR */}
            <div style={{
                width: "260px",
                background: "#111827",
                padding: "30px 20px",
                borderRight: "1px solid #334155"
            }}>
                <h2 style={{
                    marginBottom: "40px",
                    color: "#22c55e"
                }}>
                    FitZone Admin
                </h2>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px"
                }}>
                    <SidebarItem title="Dashboard" />
                    <SidebarItem title="Leads" />
                    <SidebarItem title="Analytics" />
                    <SidebarItem title="Settings" />
                </div>
            </div>
            {/* MAIN CONTENT */}
            <div style={{
                flex: 1,
                padding: "40px",
                overflowY: "auto"
            }}>
                <div style={{
                    background: "linear-gradient(135deg, #1e293b, #0f172a)",
                    padding: "28px 32px",
                    borderRadius: "18px",
                    marginBottom: "35px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    border: "1px solid #334155",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.35)"
                }}>
                    <div>
                        <p style={{
                            color: "#22c55e",
                            fontWeight: "bold",
                            marginBottom: "8px",
                            letterSpacing: "1px"
                        }}> ADMIN PANEL
                        </p>
                        <h1 style={{
                            fontSize: "38px",
                            marginBottom: "10px",
                            fontWeight: "700"
                        }}> Dashboard Overview
                        </h1>
                        <p style={{
                            color: "#94a3b8",
                            fontSize: "15px"
                        }}> Manage customer inquiries and business leads
                        </p>
                    </div>
                    <div style={{
                        background: "#22c55e",
                        color: "#000",
                        padding: "14px 22px",
                        borderRadius: "14px",
                        fontWeight: "bold",
                        fontSize: "15px",
                        boxShadow: "0 4px 12px rgba(34,197,94,0.4)"
                    }}> FitZone Admin
                    </div>
                </div>
                <div style={{
                    overflowX: "hidden",
                    width: "100%"
                }}>
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "20px",
                        marginBottom: "40px"
                    }}>
                        <DashboardCard title="Total Leads" value={totalLeads} />
                        <DashboardCard title="Today Leads" value={todayLeads} />
                        <DashboardCard title="Contacted" value={contacted} />
                        <DashboardCard title="Pending" value={pending} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search leads..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "16px 18px",
                            marginBottom: "30px",
                            borderRadius: "14px",
                            border: "1px solid #334155",
                            background: "#111827",
                            color: "white",
                            fontSize: "15px",
                            outline: "none",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.25)"
                        }}
                    />
                    <div style={{
                        background: "#111827",
                        padding: "24px",
                        borderRadius: "18px",
                        border: "1px solid #334155",
                        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
                        overflowX: "auto"
                    }}>
                        <table style={{
                            width: "100%",
                            background: "#0f172a",
                            borderCollapse: "separate",
                            borderSpacing: "0",
                            borderRadius: "16px",
                            overflow: "hidden",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.35)"
                        }}>
                            <thead style={{ background: "#22c55e" }}>
                                <tr style={{
                                    background: "linear-gradient(90deg, #16a34a, #22c55e)",
                                    color: "#22c55e"
                                }}>
                                    <th style={tableStyle}>Name</th>
                                    <th style={tableStyle}>Email</th>
                                    <th style={tableStyle}>Phone</th>
                                    <th style={tableStyle}>Subject</th>
                                    <th style={tableStyle}>Message</th>
                                    <th style={tableStyle}>Status</th>
                                    <th style={tableStyle}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    filteredLeads.map((lead, index) => (
                                        <tr key={lead.id} style={{
                                            background: index % 2 === 0 ? "#1e293b" : "#172033",
                                            transition: "0.3s ease"
                                        }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "#263449";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = index % 2 === 0 ? "#1e293b" : "#172033";
                                            }}>
                                            <td style={tableStyle}>{lead.name}</td>
                                            <td style={tableStyle}>{lead.email}</td>
                                            <td style={tableStyle}>{lead.phone}</td>
                                            <td style={tableStyle}>{lead.subject}</td>
                                            <td title={lead.message} style={{
                                                ...tableStyle,
                                                maxWidth: "250px",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                cursor: "pointer"
                                            }}
                                            > {lead.message} </td>
                                            <td style={tableStyle}>
                                                <select
                                                    value={lead.status || "NEW"}
                                                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                                                    style={{
                                                        padding: "10px 35px 10px 14px",
                                                        borderRadius: "10px",
                                                        border: "1px solid rgba(255,255,255,0.1)",
                                                        outline: "none",
                                                        background: lead.status === "CONTACTED" ? "#16a34a" : lead.status === "FOLLOW_UP" ? "#f59e0b" : lead.status === "CLOSED" ? "#ef4444" : "#3b82f6",
                                                        color: "white",
                                                        fontWeight: "600",
                                                        fontSize: "14px",
                                                        cursor: "pointer",
                                                        minWidth: "160px",
                                                        appearance: "none",
                                                        WebkitAppearance: "none",
                                                        MozAppearance: "none",
                                                        position: "relative"
                                                    }}>
                                                    <option value="NEW" style={{ background: "#1e293b", color: "white" }}>🆕 NEW</option>
                                                    <option value="CONTACTED" style={{ background: "#1e293b", color: "white" }}> 📞 CONTACTED</option>
                                                    <option value="FOLLOW_UP" style={{ background: "#1e293b", color: "white" }}> ⏳ FOLLOW UP</option>
                                                    <option value="CLOSED" style={{ background: "#1e293b", color: "white" }}> ✅ CLOSED</option>
                                                </select>
                                            </td>
                                            <td style={tableStyle}>
                                                <button
                                                    onClick={() => openDeleteModal(lead.id)}
                                                    style={{
                                                        background: "linear-gradient(135deg, #dc2626, #ef4444)",
                                                        border: "none",
                                                        color: "white",
                                                        padding: "10px 16px",
                                                        borderRadius: "10px",
                                                        cursor: "pointer",
                                                        fontWeight: "600",
                                                        transition: "0.3s ease",
                                                        boxShadow: "0 4px 12px rgba(239,68,68,0.3)"
                                                    }}
                                                >Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {
                showModal && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0,0,0,0.7)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 999
                        }}
                    >
                        <div
                            style={{
                                background: "#1e293b",
                                padding: "30px",
                                borderRadius: "16px",
                                width: "400px",
                                boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
                                textAlign: "center",
                                border: "1px solid #334155"
                            }}
                        >
                            <h2
                                style={{
                                    marginBottom: "15px",
                                    color: "white"
                                }}
                            > Delete Lead
                            </h2>
                            <p
                                style={{
                                    color: "#94a3b8",
                                    marginBottom: "30px"
                                }}
                            > Are you sure you want to delete this lead?
                            </p>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: "15px"
                                }}
                            >
                                <button
                                    onClick={() => setShowModal(false)}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: "10px",
                                        border: "none",
                                        background: "#334155",
                                        color: "white",
                                        cursor: "pointer"
                                    }}
                                > Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: "10px",
                                        border: "none",
                                        background: "#ef4444",
                                        color: "white",
                                        cursor: "pointer",
                                        fontWeight: "bold"
                                    }}
                                > Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="dark"
            />
        </div>
    );
}
const tableStyle = {
    padding: "18px 16px",
    borderBottom: "1px solid #334155",
    textAlign: "left",
    color: "white",
    fontSize: "14px"
};
