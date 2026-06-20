import "../style/Admin.css";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { apiRequest, handleApiResponse } from "../util/api";
import { formatDate } from "../util/CommonUtil";
import { AdminSidebar, DashboardCard, EmptyState } from "../components/common/index";
import AdminLayout from "../components/layout/AdminLayout";

export default function CustomerAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const membershipStatusData = analytics ? [{ name: "Active", value: analytics.stats.activeCustomers }, { name: "Expiring", value: analytics.stats.expiringCustomers }, { name: "Expired", value: analytics.stats.expiredCustomers }, { name: "Inactive", value: analytics.stats.inactiveCustomers }] : [];
    const STATUS_COLORS = ["#22c55e", "#eab308", "#ef4444", "#ed7474"];
    const PLAN_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#06b6d4"];
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    useEffect(() => { fetchCustomerAnalytics(); }, []);
    const fetchCustomerAnalytics = async () => {
        try {
            const response = await apiRequest("/api/customers/analytics");
            await handleApiResponse(response);
            const data = await response.json();
            setAnalytics(data);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };
    const planDistributionData = analytics?.planDistribution?.map(plan => ({ name: plan.planName, value: plan.count })) || [];
    const customerGrowthData = analytics?.customerGrowth || [];
    customerGrowthData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
    const recentCustomers = analytics?.recentCustomers || [];
    return (
        <AdminLayout>
            <div className="header-card">
                <div>
                    <p className="admin-label">ADMIN PANEL</p>
                    <h1 className="dashboard-title">Customer Analytics</h1>
                    <p className="dashboard-subtitle"> Customer insights, membership status and plan distribution</p>
                </div>
                <div className="admin-badge">
                    <div className="badge-dot" />
                    <span> FitZone Admin</span>
                </div>
            </div>
            {/* Customer Cards */}
            <div className="dashboard-section">
                <h3 className="cards-header"> Customer Summary </h3>
                <div className="cards-grid">
                    <DashboardCard title="Total Customers" value={analytics?.stats?.totalCustomers || 0} color="#22c55e" />
                    <DashboardCard title="Active Members" value={analytics?.stats?.activeCustomers || 0} color="#3b82f6" />
                    <DashboardCard title="Inactive Members" value={analytics?.stats?.inactiveCustomers || 0} color="#ef4444" />
                    <DashboardCard title="Expiring Soon" value={analytics?.stats?.expiringCustomers || 0} color="#f59e0b" />
                    <DashboardCard title="Expired Members" value={analytics?.stats?.expiredCustomers || 0} color="#cd5e2b" />
                    <DashboardCard title="Popular Plan" value={analytics?.mostPopularPlan || 0} color="#a81ee8c0" />
                </div>
            </div>
            {/* Charts */}
            <div className="charts-grid">
                <div className="analytics-chart-card">
                    <h3>Membership Status</h3>
                    <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                            <Pie data={membershipStatusData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label >
                                {membershipStatusData.map((_, index) => (
                                    <Cell key={index} fill={STATUS_COLORS[index]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="analytics-chart-card">
                    <h3>Plan Distribution</h3>
                    <ResponsiveContainer width="100%" height={320}>
                        <PieChart>
                            <Pie data={planDistributionData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                                {planDistributionData.map((_, index) => (
                                    <Cell key={index} fill={PLAN_COLORS[index % PLAN_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <div className="analytics-chart-card">
                <h3>Customer Growth</h3>
                <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={customerGrowthData}>
                        <defs>
                            <linearGradient id="customerGrowth" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#1d4ed8" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value}`, "Customer"]} contentStyle={{ backgroundColor: "#ffffff", borderRadius: "10px", color: "#1d4ed8" }} labelStyle={{ color: "#1d4ed8" }} itemStyle={{ color: "#1d4ed8" }} />
                        <Bar dataKey="customers" radius={[8, 8, 0, 0]} fill="url(#customerGrowth)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            {/* Plan Distribution Table */}
            <div className="charts-grid">
                <div className="customer-analytics-section">
                    <h3>Plan Distribution</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Plan</th>
                                <th>Members</th>
                            </tr>
                        </thead>
                        <tbody>{analytics?.planDistribution?.length === 0 ? (<tr>
                            <td colSpan="8">
                                <EmptyState title="No Customer Found" description="There is no data to display in this table at the moment. New entries will appear here automatically." />
                            </td>
                        </tr>
                        ) : analytics?.planDistribution?.map(plan => (
                            <tr key={plan.planName}>
                                <td>{plan.planName}</td>
                                <td>{plan.count}</td>
                            </tr>
                        ))
                        }
                        </tbody>
                    </table>
                </div>
                <div className="customer-analytics-section">
                    <h3>Recent Joinings</h3>
                    <div className="recent-customers">
                        {recentCustomers.map(customer => (
                            <div key={customer.id} className="recent-customer-item">
                                <div>
                                    <h4>{customer.name}</h4>
                                    <p> {customer.planName}</p>
                                </div>
                                <span>{formatDate(customer.joinDate)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
