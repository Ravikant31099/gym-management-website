import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { apiRequest } from "../util/api";
import "../style/Admin.css";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "../components/AdminSidebar";
import ConfirmModal from "../components/modals/ConfirmModal";
import FormModal from "../components/modals/FormModal";
import AdminLayout from "../components/Layout/AdminLayout";

export default function PlanManagement() {
    const [plans, setPlans] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingPlanId, setEditingPlanId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [search, setSearch] = useState("");
    const [popularFilter, setPopularFilter] = useState("ALL");
    const [planForm, setPlanForm] = useState({
        name: "",
        description: "",
        price: "",
        period: "",
        popular: false
    });
    useEffect(() => { fetchPlans(); }, []);
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPlanForm({
            ...planForm, [name]:
                type === "checkbox"
                    ? checked
                    : value
        });
    };
    const filteredPlans = plans.filter((plan) => {
        const matchesSearch = plan.name.toLowerCase().includes(search.toLowerCase());
        const matchesPopular = popularFilter === "ALL" || (popularFilter === "POPULAR" ? plan.popular : !plan.popular);
        return (matchesSearch && matchesPopular);
    }
    );
    const openDeleteModal = (id) => {
        setSelectedPlanId(id);
        setShowDeleteModal(true);
    };
    const openEditModal = (plan) => {
        setEditingPlanId(plan.id);
        setPlanForm({
            name: plan.name,
            description: plan.description,
            price: plan.price,
            period: plan.period,
            popular: plan.popular
        });
        setShowEditModal(true);
    };
    const validatePlanForm = () => {
        if (!planForm.name.trim()) {
            toast.error("Plan name is required");
            return false;
        }
        if (!planForm.description.trim()) {
            toast.error("Description is required");
            return false;
        }
        if (!planForm.price.trim()) {
            toast.error("Price is required");
            return false;
        }
        if (!planForm.period.trim()) {
            toast.error("Period is required");
            return false;
        }
        return true;
    };
    const fetchPlans = async () => {
        try {
            const response = await apiRequest("/api/plans", "GET");
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            console.log(error);
            toast.error("Failed to fetch plans. Please try again later.");
        }
    }
    const savePlan = async () => {
        try {
            setSaving(true);
            if (!validatePlanForm()) {
                return;
            }
            const response = await apiRequest(`/api/plans`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(planForm) });
            if (!response.ok) {
                toast.error("Failed to save plan");
                return;
            }
            const savedPlan = await response.json();
            setPlans([...plans, savedPlan]);
            toast.success("Plan added successfully");
            setShowAddModal(false);
            setPlanForm({
                name: "",
                description: "",
                price: "",
                period: "",
                popular: false
            });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setSaving(false);
        }
    };
    const deletePlan = async () => {
        try {
            setDeleting(true);
            const response = await apiRequest(`/api/plans/${selectedPlanId}`, { method: "DELETE" });
            if (!response.ok) {
                toast.error("Failed to delete plan");
                return;
            }
            setPlans(plans.filter((plan) => plan.id !== selectedPlanId));
            toast.success("Plan deleted successfully");
            setShowDeleteModal(false);
            setSelectedPlanId(null);
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setDeleting(false);
        }
    };
    const updatePlan = async () => {
        try {
            setUpdating(true);
            if (!validatePlanForm()) {
                return;
            }
            const response = await apiRequest(`/api/plans/${editingPlanId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(planForm) });
            if (!response.ok) {
                toast.error("Failed to update plan");
                return;
            }
            const updatedPlan = await response.json();
            setPlans(plans.map((plan) => plan.id === editingPlanId ? updatedPlan : plan));
            toast.success("Plan updated successfully");
            setShowEditModal(false);
            setEditingPlanId(null);
            setPlanForm({
                name: "",
                description: "",
                price: "",
                period: "",
                popular: false
            });
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        } finally {
            setUpdating(false);
        }
    };
    return (
        <AdminLayout>
            <div className="header-card">
                <div> <p className="admin-label"> ADMIN PANEL </p>
                    <h1 className="dashboard-title"> Plan Management </h1>
                    <p className="dashboard-subtitle">Manage gym membership plans</p>
                </div>
                <div>
                    <button className="add-plan-btn" onClick={() => setShowAddModal(true)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Add Plan</button>
                </div>
            </div>
            {/* SEARCH */}
            <div className="search-filter-container">
                <input type="text" className="search-input" placeholder="Search plans..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <select className="filter-select" value={popularFilter} onChange={(e) => setPopularFilter(e.target.value)}>
                    <option value="ALL"> All Plans</option>
                    <option value="POPULAR"> Popular </option>
                    <option value="NORMAL"> Normal</option>
                </select>
            </div>
            {/* TABLE */}
            <div className="table-wrapper">
                <table className="plans-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Period</th>
                            <th>Popular</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPlans.length === 0 ? (<tr>
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
                        </tr>) : (filteredPlans.map((plan) => (
                            <tr key={plan.id}>
                                <td>{plan.name}</td>
                                <td>{plan.description}</td>
                                <td>{plan.price}</td>
                                <td>{plan.period}</td>
                                <td>
                                    {plan.popular ?
                                        (<span className="popular-yes">Yes</span>) : (<span className="popular-no">No</span>)
                                    }
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="view-btn" onClick={() => openEditModal(plan)}> Edit </button>
                                        <button className="delete-btn" onClick={() => openDeleteModal(plan.id)}> Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))
                        )}
                    </tbody>
                </table>
            </div>
            {/* Add Plan Modal */}
            {showAddModal && (
                <FormModal title="Add Plan" onClose={() => setShowAddModal(false)} onSubmit={savePlan} loading={saving} buttonText="Save Plan">
                    <input type="text" name="name" placeholder="Plan Name" value={planForm.name} onChange={handleInputChange} className="search-input" />
                    <input type="text" name="description" placeholder="Description" value={planForm.description} onChange={handleInputChange} className="search-input" />
                    <input type="text" name="price" placeholder="Price" value={planForm.price} onChange={handleInputChange} className="search-input" />
                    <input type="text" name="period" placeholder="Period" value={planForm.period} onChange={handleInputChange} className="search-input" />
                    <label className="popular-checkbox-card">
                        <span>Mark as Popular Plan</span>
                        <input type="checkbox" name="popular" checked={planForm.popular} onChange={handleInputChange} />
                    </label>
                </FormModal>
            )}
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <ConfirmModal title="Delete Plan" description="Are you sure you want to delete this plan?" onClose={() => setShowDeleteModal(false)} onConfirm={deletePlan} loading={deleting} />
            )}
            {/* Edit Plan Modal */}
            {showEditModal && (
                <FormModal title="Edit Plan" onClose={() => setShowEditModal(false)} onSubmit={updatePlan} loading={updating} buttonText="Update Plan">
                    <input type="text" name="name" placeholder="Plan Name" value={planForm.name} onChange={handleInputChange} className="search-input" />
                    <input type="text" name="description" placeholder="Description" value={planForm.description} onChange={handleInputChange} className="search-input" />
                    <input type="text" name="price" placeholder="Price" value={planForm.price} onChange={handleInputChange} className="search-input" />
                    <input type="text" name="period" placeholder="Period" value={planForm.period} onChange={handleInputChange} className="search-input" />
                    <label className="popular-checkbox-card">
                        <span>Mark as Popular Plan</span>
                        <input type="checkbox" name="popular" checked={planForm.popular} onChange={handleInputChange} />
                    </label>
                </FormModal>
            )}
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </AdminLayout>
    );
}
