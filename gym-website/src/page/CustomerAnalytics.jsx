import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "../style/Admin.css";
import { apiRequest } from "../util/api";
import AdminSidebar from "../components/AdminSidebar";
import AdminLayout from "../components/layout/AdminLayout";

export default function CustomerAnalytics() {
    const [customers, setCustomers] = useState([]);
    const [analytics, setAnalytics] = useState({ totalCustomers: 0, activeCustomers: 0, expiringCustomers: 0, expiredCustomers: 0, mostPopularPlan: "-" });
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
        let expiring = 0;
        let expired = 0;
        const planCount = {};
        customerList.forEach(customer => {
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
        setAnalytics({ totalCustomers: customerList.length, activeCustomers: active, expiringCustomers: expiring, expiredCustomers: expired, mostPopularPlan: popularPlan });
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
                    <DashboardCard title="Expiring Soon" value={analytics.expiringCustomers} color="#f59e0b" />
                    <DashboardCard title="Expired Members" value={analytics.expiredCustomers} color="#ef4444" />
                    <DashboardCard title="Popular Plan" value={analytics.mostPopularPlan} color="#a81ee8c0" />
                </div>
            </div>
            {/* Plan Distribution Table */}
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
        </AdminLayout>
    );
}
