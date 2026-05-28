import { useEffect, useState } from "react";
import "../style/Admin.css";
import AdminSidebar from "../components/AdminSidebar";
import { apiRequest } from "../util/api";
import FormModal from "../components/modals/FormModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Pencil, Trash2, Eye } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

export default function CustomerManagement() {
    const [customers, setCustomers] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [customerForm, setCustomerForm] = useState({ name: "", email: "", phone: "", joinDate: "", expiryDate: "", status: "ACTIVE", planId: "" });
    useEffect(() => { fetchCustomers(); fetchPlansForCustomer(); }, []);
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const response = await apiRequest("/api/customers");
            if (!response.ok) {
                toast.error("Failed to Fetch Customer Records");
                return;
            }
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch Customer Records. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    const fetchPlansForCustomer = async () => {
        try {
            const response = await apiRequest("/api/plans", "GET");
            if (!response.ok) {
                toast.error("Failed to Fetch Customer's Plans");
                return;
            }
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            toast.error("Failed to fetch plans. Please try again later.");
            console.log(error);
        }
    };
    const handleChange = (e) => {
        setCustomerForm({ ...customerForm, [e.target.name]: e.target.value });
    };
    const validateForm = () => {
        if (!customerForm.name.trim()) {
            toast.error("Name is required");
            return false;
        }
        if (!customerForm.email.trim()) {
            toast.error("Email is required");
            return false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.email)) {
            toast.error("Invalid email");
            return false;
        }
        if (!customerForm.phone.trim()) {
            toast.error("Phone is required");
            return false;
        } else if (!/^\d{10}$/.test(customerForm.phone)) {
            toast.error("Phone must be 10 digits");
            return false;
        }
        if (!customerForm.joinDate) {
            toast.error("Join date required");
            return false;
        }
        if (!customerForm.expiryDate) {
            toast.error("Expiry date required");
            return false;
        }
        if (!customerForm.planId) {
            toast.error("Select a plan");
            return false;
        }
        return true;
    };
    const handleAddCustomer = async (e) => {
        e.preventDefault();
        setSaving(true);
        if (!validateForm()) {
            return;
        }
        try {
            const response = await apiRequest("/api/customers", { method: "POST", body: JSON.stringify(customerForm) });
            if (!response.ok) {
                toast.error("Failed to save Customer Details. Please try again later.");
                return;
            }
            const savedCustomer = await response.json();
            setCustomers([...customers, savedCustomer]);
            toast.success("Customer Added Successfully");
            setShowAddModal(false);
            setCustomerForm({ name: "", email: "", phone: "", joinDate: "", expiryDate: "", status: "ACTIVE", planId: "" });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setSaving(false);
        }
    };
    const handleEditClick = (customer) => {
        setSelectedCustomer(customer);
        setCustomerForm({ name: customer.name, email: customer.email, phone: customer.phone, joinDate: customer.joinDate, expiryDate: customer.expiryDate, status: customer.status, planId: customer.planId });
        setShowEditModal(true);
    };
    const handleUpdateCustomer = async () => {
        setUpdating(true);
        if (!validateForm()) {
            return;
        }
        try {
            const response = await apiRequest(`/api/customers/${selectedCustomer.id}`, { method: "PUT", body: JSON.stringify(customerForm) });
            if (!response.ok) {
                toast.error("Failed to update Customer Details. Please try again later.");
                return;
            }
            const updatedCustomer = await response.json();
            setCustomers(customers.map(customer => customer.id === selectedCustomer.id ? updatedCustomer : customer));
            toast.success("Customer Updated Successfully");
            setShowEditModal(false);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setUpdating(false);
        }
    };
    return (
        <div className="admin-container">
            <AdminSidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <div className="main-content">
                <button className="mobile-nav-toggle" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>☰</button>
                <div className="header-card">
                    <div>
                        <p className="admin-label"> ADMIN PANEL</p>
                        <h1 className="dashboard-title">Customer Management</h1>
                        <p className="dashboard-subtitle"> Manage gym customers and memberships</p>
                    </div>
                    <div>
                        <button className="add-customer-btn" onClick={() => setShowAddModal(true)}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Customer</button>
                    </div>
                </div>
                {/* TABLE */}
                <div className="table-wrapper">
                    <table className="customer-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Plan</th>
                                <th>Join Date</th>
                                <th>Expiry Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.length === 0 ? (<tr>
                                <td colSpan="7">
                                    <div class="empty-state">
                                        <div class="empty-state__icon">
                                            <svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24">
                                                <path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <h3 class="empty-state__title">No Records Found</h3>
                                        <p class="empty-state__description">
                                            There is no data to display in this table at the moment.
                                            New entries will appear here automatically.
                                        </p>
                                    </div>
                                </td>
                            </tr>) : customers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.name}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phone}</td>
                                    <td><span className={`plan-badge ${customer.planName.toLowerCase()}`}>{customer.planName}</span></td>
                                    <td>{customer.joinDate}</td>
                                    <td>{customer.expiryDate}</td>
                                    <td><span className={`status-badge ${customer.status.toLowerCase()}`}>{customer.status}</span></td>
                                    <td>
                                        <div className="icon-btn">
                                            <button className="edit-icn" onClick={() => handleEditClick(customer)}> <Pencil size={24} /> </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Add Customer Modal */}
            {showAddModal && (<FormModal title="Add Customer" onClose={() => setShowAddModal(false)} onSubmit={handleAddCustomer} buttonText="Save Customer">
                <input type="text" name="name" placeholder="Name" className="search-input" value={customerForm.name} onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" className="search-input" value={customerForm.email} onChange={handleChange} />
                <input type="text" name="phone" placeholder="Phone" className="search-input" value={customerForm.phone} onChange={handleChange} />
                <DatePicker selected={customerForm.joinDate ? new Date(customerForm.joinDate) : null} onChange={(date) => setCustomerForm({ ...customerForm, joinDate: date?.toISOString().split("T")[0] })} dateFormat="yyyy-MM-dd" className="custom-date-picker" placeholderText="Join Date" />
                <DatePicker selected={customerForm.expiryDate ? new Date(customerForm.expiryDate) : null} onChange={(date) => setCustomerForm({ ...customerForm, expiryDate: date?.toISOString().split("T")[0] })} dateFormat="yyyy-MM-dd" className="custom-date-picker" placeholderText="Expiry Date" />
                <select name="planId" value={customerForm.planId} className="search-input" onChange={handleChange}>
                    <option value="">Select Plan</option>
                    {plans.map((plan) => (<option key={plan.id} value={plan.id}>{plan.name}</option>))}
                </select>
                <select name="status" value={customerForm.status} className="search-input" onChange={handleChange}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                </select>
            </FormModal>
            )}
            {/* Edit Customer Model */}
            {showEditModal && (<FormModal title="Edit Customer" onClose={() => setShowEditModal(false)} onSubmit={handleUpdateCustomer} buttonText="Update Customer">
                <input type="text" name="name" placeholder="Name" className="search-input" value={customerForm.name} onChange={handleChange} />
                <input type="email" name="email" placeholder="Email" className="search-input" value={customerForm.email} onChange={handleChange} />
                <input type="text" name="phone" placeholder="Phone" className="search-input" value={customerForm.phone} onChange={handleChange} />
                <DatePicker selected={customerForm.joinDate ? new Date(customerForm.joinDate) : null} onChange={(date) => setCustomerForm({ ...customerForm, joinDate: date?.toISOString().split("T")[0] })} dateFormat="yyyy-MM-dd" className="custom-date-picker" placeholderText="Join Date" />
                <DatePicker selected={customerForm.expiryDate ? new Date(customerForm.expiryDate) : null} onChange={(date) => setCustomerForm({ ...customerForm, expiryDate: date?.toISOString().split("T")[0] })} dateFormat="yyyy-MM-dd" className="custom-date-picker" placeholderText="Expiry Date" />
                <select name="planId" value={customerForm.planId} className="search-input" onChange={handleChange}>
                    <option value="">Select Plan</option>
                    {Array.isArray(plans) && plans.map((plan) => (<option key={plan.id} value={plan.id}>{plan.name}</option>))}
                </select>
                <select name="status" value={customerForm.status} className="search-input" onChange={handleChange}>
                    <option value="ACTIVE"> ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                </select>
            </FormModal>
            )}
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </div>
    );
}