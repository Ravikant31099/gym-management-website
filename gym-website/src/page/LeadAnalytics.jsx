import "../style/Admin.css";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { apiRequest, handleApiResponse } from "../util/api";
import { AdminSidebar } from "../components/common/index";
import AdminLayout from "../components/layout/AdminLayout";
import { toast } from "react-toastify";

export default function LeadAnalytics() {
    const [leads, setLeads] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    useEffect(() => { fetchLeadStats(); }, []);
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
    const chartData = [
        {
            name: "New",
            value: leads.filter((lead) => lead.status === "NEW").length
        },
        {
            name: "Contacted",
            value: leads.filter((lead) => lead.status === "CONTACTED" || lead.status === "FOLLOW-UP").length
        },
        {
            name: "Joined",
            value: leads.filter((lead) => lead.status === "JOINED").length
        },
        {
            name: "Ignored",
            value: leads.filter((lead) => lead.status === "NOT INTERESTED").length
        }
    ];
    return (
        <AdminLayout>
            <div className="header-card">
                <div>
                    <p className="admin-label">ADMIN PANEL</p>
                    <h1 className="dashboard-title">Lead Analytics</h1>
                    <p className="dashboard-subtitle">Analyze lead performance</p>
                </div>
                <div className="admin-badge">
                    <div className="badge-dot" />
                    <span> FitZone Admin</span>
                </div>
            </div>
            {/* LEAD CHARTS */}
            <div className="charts-grid">
                <div className="analytics-chart-card">
                    <h3>Leads Analytics</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={chartData}>
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip formatter={(value) => [`${value}`, "Customer"]} contentStyle={{ backgroundColor: "#ffffff", borderRadius: "10px", color: "#1d4ed8" }} labelStyle={{ color: "#1d4ed8" }} itemStyle={{ color: "#1d4ed8" }} />
                            <Bar dataKey="value" radius={[10, 10, 0, 0]} fill="#22c55e" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="analytics-chart-card">
                    <h3>Lead Distribution</h3>
                    <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                            <Pie data={chartData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label >
                                <Cell fill="#f59e0b" />
                                <Cell fill="#3b82f6" />
                                <Cell fill="#22c55e" />
                                <Cell fill="#ef4444" />
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </AdminLayout>
    );
}