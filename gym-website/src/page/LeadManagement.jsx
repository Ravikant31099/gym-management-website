import "../style/Admin.css";
import { useEffect, useState } from "react";
import { apiRequest, handleApiResponse } from "../util/api";
import { LEAD_STATUS, DEFAULT_FILTER, LEAD_DEFAULT_SORT } from "../constants/AppConstants";
import { AdminSidebar, Loader, DetailItem, EmptyState } from "../components/common/index";
import { ConfirmModal, ViewModal, FormModal } from "../components/modals/index";
import { FileSpreadsheet, RefreshCcw } from "lucide-react";
import { allowOnlyAlphabets, allowOnlyNumbers, exportToCsv  } from "../util/CommonUtil";
import AdminLayout from "../components/layout/AdminLayout";
import { toast } from "react-toastify";

export default function LeadManagement() {
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [deletingLead, setDeletingLead] = useState(false);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);
    const [editingLead, setEditingLead] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [sortBy] = useState("createdAt");
    const [sortDir] = useState(LEAD_DEFAULT_SORT);
    const statusOptions = [LEAD_STATUS.NEW, LEAD_STATUS.CONTACTED, LEAD_STATUS.FOLLOWUP, LEAD_STATUS.JOINED, LEAD_STATUS.NOTINTERESTED];
    const [leadForm, setLeadForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

    const resetFilters = () => { setSearch(""); setStatusFilter(DEFAULT_FILTER); };

    useEffect(() => { fetchLeads(); }, [page, debouncedSearch, statusFilter]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);
    useEffect(() => { setPage(0); }, [search, statusFilter]);

    const openViewModal = (lead) => {
        setSelectedLead(lead);
        setShowViewModal(true);
    };
    const openDeleteModal = (id) => {
        setSelectedLead(id);
        setShowDeleteModal(true);
    };
    const confirmDelete = () => {
        deleteLead(selectedLead);
        setShowDeleteModal(false);
        setSelectedLead(null);
    };
    const handleEditLead = (lead) => {
        setEditingLead(lead);
        setLeadForm({ name: lead.name, email: lead.email, phone: lead.phone, subject: lead.subject, message: lead.message });
        setShowEditModal(true);
    };
    const closeModal = () => {
        setShowEditModal(false);
        setEditingLead(null);
        setLeadForm({ name: "", email: "", phone: "", subject: "", message: "" });
    };
    const handleInputChange = (e) => {
        let { name, value } = e.target;
        if (name === "name") {
            value = allowOnlyAlphabets(value);
        }
        if (name === "phone") {
            value = allowOnlyNumbers(value);
        }
        setLeadForm({ ...leadForm, [name]: value });
    };
    const fetchLeads = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ page, size, search: debouncedSearch.trim(), status: statusFilter === "ALL" ? "" : statusFilter, sortBy, sortDir});
            const response = await apiRequest(`/api/leads?${params}`);
            await handleApiResponse(response);
            const data = await response.json();
            setLeads(data.content);
            setTotalPages(data.totalPages);
            setTotalElements(data.totalElements);
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };
    const updateLead = async () => {
        try {
            setUpdating(true);
            const response = await apiRequest(`/api/leads/${editingLead.id}`,
                { method: "PUT", body: JSON.stringify(leadForm) }
            );
            await handleApiResponse(response);
            toast.success("Lead updated successfully.");
            await fetchLeads();
            closeModal();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setUpdating(false);
        }
    };
    const deleteLead = async (id) => {
        try {
            setDeletingLead(true);
            const response = await apiRequest(`/api/leads/${id}`, { method: "DELETE" });
            await handleApiResponse(response);
            toast.success("Lead deleted successfully");
            await fetchLeads();
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setDeletingLead(false);
        }
    };
    const updateStatus = async (id, status) => {
        try {
            setUpdatingStatusId(id);
            const response = await apiRequest(`/api/leads/${id}/status?status=${status}`, { method: "PUT" });
            await handleApiResponse(response);
            const updatedLead = await response.json();
            setLeads(leads.map((lead) => lead.id === id ? updatedLead : lead));
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setUpdatingStatusId(null);
        }
    };
    const handleExportLeads = async () => {
        try {
            setExporting(true);
            const params = new URLSearchParams();
            if (debouncedSearch.trim()) {
                params.append("search", debouncedSearch.trim());
            }
            if (statusFilter !== "ALL") {
                params.append("status", statusFilter);
            }
            const response = await apiRequest(`/api/leads/export?${params}`);
            await handleApiResponse(response);
            const data = await response.json();
            if (!data || data.length === 0) {
                toast.warning("No lead data found.");
                return;
            }
            const headers = ["ID", "Name", "Email", "Phone", "Subject", "Status", "Created Date"];
            const rows = data.map(lead => [lead.id, lead.name, lead.email, lead.phone, lead.subject, lead.status, lead.createdAt]);
            let fileName = "fitzone_leads";
            if (statusFilter !== "ALL") {
                fileName += `_${statusFilter.toLowerCase()}`;
            }
            fileName += `_${new Date().toISOString().split("T")[0]}.csv`;
            exportToCsv(headers, rows, fileName);
            toast.success("Lead report exported successfully.");
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setExporting(false);
        }
    };
    return (
        <AdminLayout>
            <div className="header-card">
                <div>
                    <p className="admin-label"> ADMIN PANEL </p>
                    <h1 className="dashboard-title"> Lead Management </h1>
                    <p className="dashboard-subtitle"> Manage customer inquiries </p>
                </div>
                <div className="admin-badge">
                    <div className="badge-dot" />
                    <span> FitZone Admin</span>
                </div>
            </div>
            {/* SEARCH */}
            <div className="search-filter-container">
                <input type="text" placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                    <option value="ALL">All Status</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
            {/* TABLE */}
            <div className="table-top">
                <div className="table-summary"> Total Leads: {totalElements}</div>
                <div>
                    <button className="export-btn" title="Export Leads to Excel" onClick={handleExportLeads}> {exporting ? "..." : ""}<FileSpreadsheet color="#30c40f" size={24} strokeWidth={2} /></button>
                    <button className="refresh-btn" onClick={resetFilters}> <RefreshCcw color="#2563EB" size={24} strokeWidth={2} /> </button>
                </div>
            </div>
            <div className="table-wrapper">
                <table className="leads-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="7">
                                    <Loader />
                                </td>
                            </tr>

                        ) : leads.length === 0 ? (<tr>
                            <td colSpan="7">
                                <EmptyState title="No Leads Found" description="There is no data to display in this table at the moment. New entries will appear here automatically." />
                            </td>
                        </tr>
                        ) : (leads.map((lead, index) =>
                            <tr key={lead.id} className={index % 2 === 0 ? "row-even" : "row-odd"} onClick={() => openViewModal(lead)}>
                                <td data-label="Name">{lead.name}</td>
                                <td data-label="Email"><span>{lead.email}</span></td>
                                <td data-label="Phone">{lead.phone}</td>
                                <td data-label="Subject">{lead.subject}</td>
                                <td data-label="Message" title={lead.message} className="message-cell"><span>{lead.message}</span> </td>
                                <td data-label="Status">
                                    <select value={lead.status || "NEW"} onChange={(e) => updateStatus(lead.id, e.target.value)}
                                        className="status-select"
                                        disabled={updatingStatusId === lead.id}>
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>{status} </option>
                                        ))}
                                    </select>
                                </td>
                                <td data-label="Action">
                                    <div className="action-buttons">
                                        <button className="delete-btn" onClick={(e) => { e.stopPropagation(); openDeleteModal(lead.id) }}> Delete</button>
                                        <button className="edit-btn" onClick={(e) => { e.stopPropagation(); handleEditLead(lead) }}> Edit</button>
                                    </div>
                                </td>
                            </tr>
                        )
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination Content*/}
            <div className="pagination-wrapper">
                <div className="pagination-container">
                    <button disabled={page === 0} onClick={() => setPage(prev => prev - 1)}>Previous</button>
                    <span> Page {page + 1} of {totalPages}</span>
                    <button disabled={page + 1 >= totalPages} onClick={() => setPage(prev => prev + 1)}>Next</button>
                </div>
            </div>
            {/* VIEW MODAL */}
            {showViewModal && selectedLead && (
                <ViewModal title="Lead Details" onClose={() => setShowViewModal(false)}>
                    <DetailItem label="Name" value={selectedLead.name} />
                    <DetailItem label="Email" value={selectedLead.email} />
                    <DetailItem label="Phone" value={selectedLead.phone} />
                    <DetailItem label="Subject" value={selectedLead.subject} />
                    <DetailItem label="Status" value={selectedLead.status} />
                    <DetailItem label="Message" value={selectedLead.message} />
                </ViewModal>
            )}
            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteModal && (
                <ConfirmModal title="Delete Lead" description="Are you sure you want to delete this lead?" onClose={() => setShowDeleteModal(false)} onConfirm={confirmDelete} loading={deletingLead} />
            )}
            {/* EDIT MODAL */}
            {showEditModal && (<FormModal title="Edit Lead" onClose={() => setShowEditModal(false)} onSubmit={updateLead} loading={updating} buttonText="Update Lead">
                <input type="text" className="search-input" name="name" maxLength={50} value={leadForm.name} onChange={ handleInputChange } placeholder="Name" />
                <input type="email" className="search-input" name="email" maxLength={50} value={leadForm.email} onChange={ handleInputChange } placeholder="Email" />
                <input type="text" className="search-input" name="phone" maxLength={12} value={leadForm.phone} onChange={ handleInputChange } placeholder="Phone" />
                <input type="text" className="search-input" name="subject" maxLength={100} value={leadForm.subject} onChange={ handleInputChange } placeholder="Subject" />
                <textarea rows="4" className="search-input" name="message" maxLength={500} value={leadForm.message} onChange={ handleInputChange } placeholder="Message" />
            </FormModal>
            )}
        </AdminLayout>
    );
}