import "../style/Admin.css";
import { useEffect, useState } from "react";
import { apiRequest, handleApiResponse } from "../util/api";
import { APP_CONFIG, PLAN_PERIOD, PLAN_TYPE, DEFAULT_FILTER } from "../constants/AppConstants";
import { FileSpreadsheet, RefreshCcw } from "lucide-react";
import { formatCurrency, formatPlanDuration, allowOnlyAlphabets, allowDecimal } from "../util/CommonUtil";
import { AdminSidebar, EmptyState, DetailItem, Loader } from "../components/common/index";
import { ConfirmModal, FormModal, ViewModal } from "../components/modals/index";
import AdminLayout from "../components/Layout/AdminLayout";
import { toast } from "react-toastify";

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
    const [tableLoading, setTableLoading] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [search, setSearch] = useState("");
    const [popularFilter, setPopularFilter] = useState("ALL");
    const [planForm, setPlanForm] = useState({ name: "", description: "", price: "", period: PLAN_PERIOD.MONTH, popular: false });
    const [exporting, setExporting] = useState(false);
    const resetFilters = () => { setSearch(""); setPopularFilter(DEFAULT_FILTER) };

    useEffect(() => { fetchPlans(); }, []);
    const handleInputChange = (e) => {
        let { name, value, type, checked } = e.target;
        if (name === "name") {
            value = allowOnlyAlphabets(value);
        }
        if (name === "price") {
            value = allowDecimal(value);
        }
        setPlanForm({ ...planForm, [name]: type === "checkbox" ? checked : value, });
    };
    const filteredPlans = plans.filter((plan) => {
        const matchesSearch = plan.name.toLowerCase().includes(search.toLowerCase());
        const matchesPopular = popularFilter === "ALL" || (popularFilter === "POPULAR" ? plan.popular : !plan.popular);
        return (matchesSearch && matchesPopular);
    });
    const totalPlans = plans.length;
    const openDeleteModal = (id) => {
        setSelectedPlanId(id);
        setShowDeleteModal(true);
    };
    const openEditModal = (plan) => {
        setEditingPlanId(plan.id);
        setPlanForm({ name: plan.name, description: plan.description, price: plan.price, period: plan.period, popular: plan.popular });
        setShowEditModal(true);
    };
    const handleViewPlan = (plan) => {
        setSelectedPlan(plan);
        setShowViewModal(true);
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
        if (!planForm.price) {
            toast.error("Price is required");
            return false;
        }
        if (!planForm.period) {
            toast.error("Period is required");
            return false;
        }
        return true;
    };
    const fetchPlans = async () => {
        try {
            setTableLoading(true);
            const response = await apiRequest("/api/plans", "GET");
            await handleApiResponse(response);
            const data = await response.json();
            setPlans(data);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setTableLoading(false);
        }
    }
    const savePlan = async () => {
        try {
            setSaving(true);
            if (!validatePlanForm()) {
                return;
            }
            const response = await apiRequest(`/api/plans`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(planForm) });
            await handleApiResponse(response);
            const savedPlan = await response.json();
            setPlans([...plans, savedPlan]);
            toast.success("Plan added successfully");
            setShowAddModal(false);
            resetPlanForm();
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };
    const deletePlan = async () => {
        try {
            setDeleting(true);
            const response = await apiRequest(`/api/plans/${selectedPlanId}`, { method: "DELETE" });
            await handleApiResponse(response);
            setPlans(plans.filter((plan) => plan.id !== selectedPlanId));
            toast.success("Plan deleted successfully");
            setShowDeleteModal(false);
            setSelectedPlanId(null);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
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
            await handleApiResponse(response);
            const updatedPlan = await response.json();
            setPlans(plans.map((plan) => plan.id === editingPlanId ? updatedPlan : plan));
            toast.success("Plan updated successfully");
            setShowEditModal(false);
            setEditingPlanId(null);
            resetPlanForm();
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setUpdating(false);
        }
    };
    const resetPlanForm = () => {
        setPlanForm({ name: "", description: "", price: "", period: PLAN_PERIOD.MONTH, popular: false });
    };
    const handleExportPlans = async () => {
        try {
            setExporting(true);
            const response = await apiRequest("/api/plans/export");
            await handleApiResponse(response);
            const data = await response.json();
            if (!data.length) {
                toast.warning("No plans found");
                return;
            }
            exportToCsv(data);
            toast.success("Plans exported successfully");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setExporting(false);
        }
    };
    const exportToCsv = (data) => {
        const headers = ["Plan Name", "Price", "Duration (Months)", "Description", "Popular"];
        const rows = data.map(plan => [plan.name, plan.price, plan.period, plan.description, plan.popular ? "Yes" : "No"]);
        const csv = [headers.join(","), ...rows.map(row => row.map(value => `"${value ?? ""}"`).join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `fitzone_plans_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
                    <option value={PLAN_TYPE.POPULAR}> Popular </option>
                    <option value={PLAN_TYPE.NORMAL}> Normal</option>
                </select>
            </div>
            {/* TABLE */}
            <div className="table-top">
                <div className="table-summary"> Total Plans: {totalPlans}</div>
                <div>
                    <button className="export-btn" title="Export Customers to Excel" onClick={handleExportPlans}> {exporting ? "..." : ""}<FileSpreadsheet color="#30c40f" size={24} strokeWidth={2} /></button>
                    <button className="refresh-btn" onClick={resetFilters}> <RefreshCcw color="#2563EB" size={24} strokeWidth={2} /> </button>
                </div>
            </div>
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
                        {tableLoading ? (
                            <tr>
                                <td colSpan="6" className="table-loader">
                                    <Loader />
                                </td>
                            </tr>
                        ) : filteredPlans.length === 0 ? (<tr>
                            <td colSpan="6">
                                <EmptyState title="No Plan Found" description="There is no data to display in this table at the moment. New entries will appear here automatically." />
                            </td>
                        </tr>) : (filteredPlans.map((plan) => (
                            <tr key={plan.id} onClick={() => handleViewPlan(plan)}>
                                <td data-label="Name">{plan.name}</td>
                                <td data-label="Description" className="plans-description"><span>{plan.description}</span></td>
                                <td data-label="Price">{formatCurrency(plan.price)}</td>
                                <td data-label="Period">{formatPlanDuration(plan.period)}</td>
                                <td data-label="Popular">
                                    {plan.popular ?
                                        (<span className="popular-yes">Yes</span>) : (<span className="popular-no">No</span>)
                                    }
                                </td>
                                <td data-label="Action">
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
                    <select name="period" value={planForm.period} className="filter-select-modal" onChange={handleInputChange}>
                        <option value={PLAN_PERIOD.MONTH}>MONTH</option>
                        <option value={PLAN_PERIOD.THREE_MONTH}>3 MONTH</option>
                        <option value={PLAN_PERIOD.SIX_MONTH}>6 MONTH</option>
                        <option value={PLAN_PERIOD.NINE_MONTH}>9 MONTH</option>
                        <option value={PLAN_PERIOD.YEAR}>YEAR</option>
                    </select>
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
                    <select name="period" value={planForm.period} className="filter-select-modal" onChange={handleInputChange}>
                        <option value={PLAN_PERIOD.MONTH}>MONTH</option>
                        <option value={PLAN_PERIOD.THREE_MONTH}>3 MONTH</option>
                        <option value={PLAN_PERIOD.SIX_MONTH}>6 MONTH</option>
                        <option value={PLAN_PERIOD.NINE_MONTH}>9 MONTH</option>
                        <option value={PLAN_PERIOD.YEAR}>YEAR</option>
                    </select>
                    <label className="popular-checkbox-card">
                        <span>Mark as Popular Plan</span>
                        <input type="checkbox" name="popular" checked={planForm.popular} onChange={handleInputChange} />
                    </label>
                </FormModal>
            )}
            {/* View Plan Modal */}
            {showViewModal && selectedPlan && (<ViewModal title="Plan Details" onClose={() => { setShowViewModal(false); setSelectedPlan(null); }}>
                <DetailItem label="Plan Name" value={selectedPlan.name} />
                <DetailItem label="Description" value={selectedPlan.description} />
                <DetailItem label="Price" value={formatCurrency(selectedPlan.price)} />
                <DetailItem label="Period" value={formatPlanDuration(selectedPlan.period)} />
                <DetailItem label="Popular" value={selectedPlan.popular ? "Yes" : "No"} />
            </ViewModal>
            )}
        </AdminLayout>
    );
}
