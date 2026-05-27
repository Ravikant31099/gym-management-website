import { useEffect, useState } from "react";
import "../style/Admin.css";
import AdminSidebar from "../components/AdminSidebar";
import { apiRequest } from "../util/api";

export default function CustomerManagement() {
    const [customers, setCustomers] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    useEffect(() => { fetchCustomers(); }, []);
    const fetchCustomers = async () => {
        try {
            const response = await apiRequest("/api/customers");
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className="admin-container">
            <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="main-content">
                <button className="mobile-nav-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
                <div className="header-card">
                    <div>
                        <p className="admin-label"> CUSTOMER MANAGEMENT</p>
                        <h1 className="dashboard-title">Customers</h1>
                        <p className="dashboard-subtitle"> Manage gym customers and memberships</p>
                    </div>
                </div>
                <div className="table-wrapper">
                    <table className="leads-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Plan</th>
                                <th>Join Date</th>
                                <th>Expiry Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.name}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phone}</td>
                                    <td>{customer.planName}</td>
                                    <td>{customer.joinDate}</td>
                                    <td>{customer.expiryDate}</td>
                                    <td>{customer.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}