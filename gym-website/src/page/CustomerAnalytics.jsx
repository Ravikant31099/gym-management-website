import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import "../style/Admin.css";
import { apiRequest } from "../util/api";
import AdminSidebar from "../components/AdminSidebar";
import AdminLayout from "../components/layout/AdminLayout";

export default function CustomerAnalytics() {
    const [customers, setCustomers] = useState([]);
    const [analytics, setAnalytics] = useState({ totalCustomers: 0, inactiveCustomers: 0, activeCustomers: 0, expiringCustomers: 0, expiredCustomers: 0, mostPopularPlan: "-" });
    const membershipStatusData = [{ name: "Active", value: analytics.activeCustomers }, { name: "Expiring", value: analytics.expiringCustomers }, { name: "Expired", value: analytics.expiredCustomers }, { name: "Inactive", value: analytics.inactiveCustomers }];
    const STATUS_COLORS = ["#22c55e", "#eab308", "#ef4444", "#ed7474"];
    const PLAN_COLORS = ["#3b82f6", "#8b5cf6", "#ec4899", "#f97316", "#06b6d4"];
    const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    useEffect(() => { fetchCustomerAnalytics(); }, []);
    const fetchCustomerAnalytics = async () => {
        try {
            const response = await apiRequest("/api/customers");
            if (!response.ok) {
                return;
            }
            const data = await response.json();
            setCustomers(data);
            calculateAnalytics(data);
        } catch (error) {
            console.log(error);
        }
    };
    const calculateAnalytics = (customerList) => {
        const today = new Date();
        let active = 0;
        let inactive = 0;
        let expiring = 0;
        let expired = 0;
        const planCount = {};
        customerList.forEach(customer => {
            if (customer.status === "INACTIVE") {
                inactive++;
                return;
            }
            const expiry = new Date(customer.expiryDate);
            const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
            if (diffDays < 0) {
                expired++;
            } else if (diffDays <= 7) {
                expiring++;
            } else {
                active++;
            }
            const plan = customer.planName;
            planCount[plan] = (planCount[plan] || 0) + 1;
        });
        let popularPlan = "-";
        let maxCount = 0;
        Object.entries(planCount).forEach(([plan, count]) => {
            if (count > maxCount) {
                maxCount = count;
                popularPlan = plan;
            }
        });
        setAnalytics({ totalCustomers: customerList.length, inactiveCustomers: inactive, activeCustomers: active, expiringCustomers: expiring, expiredCustomers: expired, mostPopularPlan: popularPlan });
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
    };
    const planDistributionData = Object.entries(customers.reduce((acc, customer) => {
        acc[customer.planName] = (acc[customer.planName] || 0) + 1;
        return acc;
    }, {})).map(([name, value]) => ({ name, value }));
    const customerGrowthData = Object.values(customers.reduce((acc, customer) => {
        const date = new Date(customer.joinDate);
        const month = date.toLocaleString("default", { month: "short" });
        if (!acc[month]) {
            acc[month] = { month, customers: 0 };
        }
        acc[month].customers++;
        return acc;
    }, {}));
    customerGrowthData.sort((a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month));
    const recentCustomers = [...customers].sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate)).slice(0, 5);
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
                    <DashboardCard title="Total Customers" value={analytics.totalCustomers} color="#22c55e" />
                    <DashboardCard title="Active Members" value={analytics.activeCustomers} color="#3b82f6" />
                    <DashboardCard title="Inactive Members" value={analytics.inactiveCustomers} color="#ef4444" />
                    <DashboardCard title="Expiring Soon" value={analytics.expiringCustomers} color="#f59e0b" />
                    <DashboardCard title="Expired Members" value={analytics.expiredCustomers} color="#cd5e2b" />
                    <DashboardCard title="Popular Plan" value={analytics.mostPopularPlan} color="#a81ee8c0" />
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
                        <Tooltip />
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
                        <tbody>{Object.entries(customers.reduce((acc, customer) => { acc[customer.planName] = (acc[customer.planName] || 0) + 1; return acc; }, {})).map(([plan, count]) => (
                            <tr key={plan}>
                                <td>{plan}</td>
                                <td>{count}</td>
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
                                <span>{customer.joinDate}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
