import "../style/Admin.css";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { apiRequest, handleApiResponse } from "../util/api";
import { AdminSidebar, DashboardCard } from "../components/common/index";
import AdminLayout from "../components/layout/AdminLayout";
import { toast } from "react-toastify";

export default function LeadAnalytics() {
    const [analytics, setAnalytics] = useState({ totalLeads: 0, newLeads: 0, contactedLeads: 0, followUpLeads: 0, joinedLeads: 0, notInterestedLeads: 0});
    
    useEffect(() => { fetchLeadAnalytics(); }, []);
    const fetchLeadAnalytics = async () => {
        try {
            const response = await apiRequest("/api/leads/analytics");
            await handleApiResponse(response);
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            toast.error(error.message);
        }
    };
    const chartData = [
        {
            name: "New",
            value: analytics?.newLeads || 0
        },
        {
            name: "Joined",
            value: analytics?.joinedLeads || 0
        },
        {
            name: "Not-Interested",
            value: analytics?.notInterestedLeads || 0
        },
        {
            name: "Contacted",
            value: analytics?.contactedLeads || 0
        },
        {
            name: "Follow-up",
            value: analytics?.followUpLeads || 0
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
            {/* Customer Cards */}
                        <div className="dashboard-section">
                            <h3 className="cards-header"> Leads Summary </h3>
                            <div className="cards-grid">
                                <DashboardCard title="Total Leads" value={analytics?.totalLeads || 0} color="#22c55e" />
                                <DashboardCard title="New Leads" value={analytics?.newLeads || 0} color="#3b82f6" />
                                <DashboardCard title="Contacted Leads" value={analytics?.contactedLeads || 0} color="#ef4444" />
                                <DashboardCard title="Follow-up Leads" value={analytics?.followUpLeads || 0} color="#f59e0b" />
                                <DashboardCard title="Joined Leads" value={analytics?.joinedLeads || 0} color="#cd5e2b" />
                                <DashboardCard title="Not-Interested" value={analytics?.notInterestedLeads || 0} color="#a81ee8c0" />
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
                            <Tooltip formatter={(value) => [`${value}`, "Leads"]} contentStyle={{ backgroundColor: "#ffffff", borderRadius: "10px", color: "#1d4ed8" }} labelStyle={{ color: "#1d4ed8" }} itemStyle={{ color: "#1d4ed8" }} />
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
                                <Cell fill="#8b5cf6" />
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