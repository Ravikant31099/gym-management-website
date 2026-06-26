import "../style/Admin.css";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from "recharts";
import { apiRequest, handleApiResponse } from "../util/api";
import { getAmountValue, formatCurrency } from "../util/CommonUtil";
import { APP_CONFIG } from "../constants/AppConstants";
import { AdminSidebar, DashboardCard } from "../components/common/index";
import AdminLayout from "../components/layout/AdminLayout";

export default function PaymentAnalytics() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pieColors = ["#3b82f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => { fetchAnalytics(); }, []);
    const fetchAnalytics = async () => {
        const response = await apiRequest("/api/payments/analytics");
        await handleApiResponse(response);
        const data = await response.json();
        setAnalytics(data);
    };
    return (
        <AdminLayout>
            <div className="header-card">
                <div>
                    <p className="admin-label">ADMIN PANEL</p>
                    <h1 className="dashboard-title">Payment Analytics</h1>
                    <p className="dashboard-subtitle"> Payment insights, transaction details and revenue analysis</p>
                </div>
                <div className="admin-badge">
                    <div className="badge-dot" />
                    <span> FitZone Admin</span>
                </div>
            </div>
            {/* Payment Summary Cards */}
            <div className="dashboard-section">
                <h3 className="cards-header"> Payment Summary </h3>
                <div className="cards-grid">
                    <DashboardCard title="Total Revenue" value={`${formatCurrency(analytics?.summary.totalRevenue)}`} color="#22c55e" />
                    <DashboardCard title="Pending Revenue" value={`${formatCurrency(analytics?.summary.pendingRevenue)}`} color="#3b82f6" />
                    <DashboardCard title="Today's Collection" value={`${formatCurrency(analytics?.summary.todayCollection)}`} color="#ef4444" />
                    <DashboardCard title="Transactions" value={analytics?.summary.totalTransactions} color="#f59e0b" />
                </div>
            </div>
            <div className="analytics-chart-card">
                <h3>Membership Status</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={analytics?.revenueByPlan || []}>
                        <defs>
                            <linearGradient id="planRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#60a5fa" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="plan" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${formatCurrency(value)}`, "Revenue"]} contentStyle={{ backgroundColor: "#ffffff", borderRadius: "10px", color: "#1d4ed8" }} labelStyle={{ color: "#1d4ed8" }} itemStyle={{ color: "#1d4ed8" }} />
                        <Bar dataKey="revenue" fill="url(#planRevenueGradient)" radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="charts-grid">
                <div className="analytics-chart-card">
                    <h3>Membership Status</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <PieChart>
                            <Pie data={analytics?.paymentModes || []} cx="50%" cy="50%" outerRadius={130} dataKey="value" nameKey="name" label>
                                {analytics?.paymentModes.map((entry, index) => (<Cell key={index} fill={pieColors[index % pieColors.length]} />))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="Payment-analytics-section">
                    <h3>Top Performing Plans</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Plan</th>
                                <th>Revenue</th>
                            </tr>
                        </thead>
                        <tbody>{analytics?.topPlans.map(
                            (plan, index) => (
                                <tr key={plan.plan}>
                                    <td> {index === 0 && "1"} {index === 1 && "2"} {index === 2 && "3"} {index > 2 && `#${index + 1}`}</td>
                                    <td>{plan.plan}</td>
                                    <td><span className="revenue-pill">{formatCurrency(plan.revenue)}</span></td>
                                </tr>))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="analytics-chart-card">
                <h3>Revenue By Month</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={analytics?.revenueByMonth || []}>
                        <defs>
                            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="monthYear" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${formatCurrency(value)}`, "Revenue"]} />
                        <Area type="monotone" dataKey="revenue" stroke="#22c55e" fill="url(#revenueGradient)" strokeWidth={3} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </AdminLayout>
    );
} 