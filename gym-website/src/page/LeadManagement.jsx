import "../style/Admin.css";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { apiRequest, handleApiResponse } from "../util/api";
import { LEAD_STATUS } from "../constants/AppConstants";
import { AdminSidebar, DetailItem, EmptyState } from "../components/common/index";
import { ConfirmModal, ViewModal } from "../components/modals/index";
import AdminLayout from "../components/layout/AdminLayout";

export default function LeadManagement() {
    const [leads, setLeads] = useState([]);
    const [search, setSearch] = useState("");
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedLead, setSelectedLead] = useState(null);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [deletingLead, setDeletingLead] = useState(false);
    const [updatingStatusId, setUpdatingStatusId] = useState(null);
    const statusOptions = [LEAD_STATUS.NEW, LEAD_STATUS.CONTACTED, LEAD_STATUS.FOLLOWUP, LEAD_STATUS.JOINED, LEAD_STATUS.NOTINTERESTED];
    const filteredLeads = leads.filter((lead) => {
        const matchesSearch = lead.name.toLowerCase().includes(search.toLowerCase()) || lead.email.toLowerCase().includes(search.toLowerCase()) || lead.phone.includes(search);
        const matchesStatus = statusFilter === "ALL" || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    useEffect(() => { const isAnyModalOpen = showViewModal || showDeleteModal; document.body.style.overflow = isAnyModalOpen ? "hidden" : "auto"; }, [showViewModal, showDeleteModal]);
    const openViewModal = (lead) => { setSelectedLead(lead); setShowViewModal(true); };
    const openDeleteModal = (id) => { setSelectedLead(id); setShowDeleteModal(true); };
    const confirmDelete = () => { deleteLead(selectedLeadId); setShowDeleteModal(false); setSelectedLead(null); };
    useEffect(() => { fetchLeadStats(); }, []);
    const fetchLeadStats = async () => {
        try {
            const response = await apiRequest("/api/leads");
            await handleApiResponse(response);
            const data = await response.json();
            setLeads(data);
        } catch (e) {
            console.log(e);
            toast.error("Failed to fetch leads. Please try again later.");
        }
    };
    const deleteLead = async (id) => {
        try {
            setDeletingLead(true);
            const response = await apiRequest(`/api/leads/${id}`, { method: "DELETE" });
            await handleApiResponse(response);
            setLeads(leads.filter((lead) => lead.id !== id));
            toast.success("Lead deleted successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete leads. Please try again later.");
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
            toast.error("Failed to update leads. Please try again later.");
        } finally {
            setUpdatingStatusId(null);
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
                        {filteredLeads.length === 0 ? (<tr>
                            <td colSpan="7">
                                <EmptyState title="No Leads Found" description="There is no data to display in this table at the moment. New entries will appear here automatically." />
                            </td>
                        </tr>
                        ) : (filteredLeads.map((lead, index) =>
                            <tr key={lead.id} className={index % 2 === 0 ? "row-even" : "row-odd"}>
                                <td>{lead.name}</td>
                                <td>{lead.email}</td>
                                <td>{lead.phone}</td>
                                <td>{lead.subject}</td>
                                <td title={lead.message} className="message-cell">{lead.message} </td>
                                <td>
                                    <select value={lead.status || "NEW"} onChange={(e) => updateStatus(lead.id, e.target.value)}
                                        className="status-select"
                                        disabled={updatingStatusId === lead.id}>
                                        {statusOptions.map((status) => (
                                            <option key={status} value={status}>{status} </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button className="view-btn" onClick={() => openViewModal(lead)}> View</button>
                                        <button className="delete-btn" onClick={() => openDeleteModal(lead.id)}> Delete</button>
                                    </div>
                                </td>
                            </tr>
                        )
                        )}
                    </tbody>
                </table>
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
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />
        </AdminLayout>
    );
}