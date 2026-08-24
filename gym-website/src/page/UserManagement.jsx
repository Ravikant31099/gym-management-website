import "../style/Admin.css";
import AdminLayout from "../components/layout/AdminLayout";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { apiRequest, handleApiResponse } from "../util/api";
import { UserX, Trash2, Pencil, FileSpreadsheet, RefreshCcw, Eye, EyeOff } from "lucide-react";
import { AdminSidebar, Loader, DetailItem, EmptyState, PasswordRule } from "../components/common/index";
import { USER_ROLE, USER_DEFAULT_SORT } from "../constants/AppConstants";
import { ConfirmModal, FormModal } from "../components/modals/index";
import { exportToCsv } from "../util/CommonUtil";

export default function UserManagement() {
    const [tableLoading, setTableLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [exporting, setExporting] = useState(false);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortDir, setSortDir] = useState(USER_DEFAULT_SORT);
    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "RECEPTIONIST"
    });
    const passwordRules = {
        minLength: userForm.password.length >= 8,
        upperCase: /[A-Z]/.test(userForm.password),
        lowerCase: /[a-z]/.test(userForm.password),
        number: /\d/.test(userForm.password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(userForm.password)
    };
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        role: ""
    });
    const navigate = useNavigate();
    const resetFilters = () => { setSearch(""); setSelectedRole(""); setSelectedStatus(""); setSortBy("createdAt"); setSortDir(USER_DEFAULT_SORT); setPage(0); };

    useEffect(() => { 
        fetchUsers(); 
    }, [page, debouncedSearch, selectedRole, selectedStatus, sortBy, sortDir]);
    useEffect(() => { 
        setPage(0); 
    }, [search, selectedStatus, selectedRole]);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);
    const fetchUsers = async () => {
        try {
            setTableLoading(true);
            const params = new URLSearchParams();
            params.append("page", page);
            params.append("size", size);
            if (search.trim()) {
                params.append("search", search.trim());
            }
            if (selectedRole) {
                params.append("role", selectedRole);
            }
            if (selectedStatus !== "") {
                params.append("active", selectedStatus);
            }
            params.append("sort", `${sortBy},${sortDir}`);
            const response = await apiRequest(
                `/api/users?${params.toString()}`
            );
            await handleApiResponse(response);
            const data = await response.json();
            setUsers(data.content);
            setTotalPages(data.totalPages);
            setTotalRecords(data.totalElements);
        } catch (error) {
            toast.error(error.message);
        } finally {
            setTableLoading(false);
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserForm(prev => ({
            ...prev,
            [name]: value
        }));
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };
    const handleCreateUser = async (e) => {
        if (saving) return;
        if (!validateUserForm()) {
            return;
        }
        e.preventDefault();
        try {
            setSaving(true);
            const payload = { ...userForm, name: userForm.name.trim(), email: userForm.email.trim().toLowerCase() };
            const response = await apiRequest("/api/users", {
                method: "POST",
                body: JSON.stringify(payload)
            });
            await handleApiResponse(response);
            toast.success("User created successfully.");
            setShowCreateModal(false);
            setUserForm({
                name: "",
                email: "",
                password: "",
                role: "RECEPTIONIST"
            });
            fetchUsers();
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };
    const validateField = (name, value) => {
        let error = "";
        switch (name) {
            case "name":
                if (!value.trim()) {
                    error = "Name is required.";
                } else if (value.trim().length < 3) {
                    error = "Minimum 3 characters required.";
                }
                break;
            case "email":
                if (!value.trim()) {
                    error = "Email is required.";
                } else if (
                    !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)
                ) {
                    error = "Enter a valid email address.";
                }
                break;
            case "role":
                if (!value) {
                    error = "Role is required.";
                }
                break;
            default: break;
        }
        return error;
    };
    const validateUserForm = () => {
        const newErrors = {};
        const name = userForm.name.trim();
        const email = userForm.email.trim();
        const password = userForm.password;
        const isPasswordValid = passwordRules.minLength && passwordRules.upperCase && passwordRules.lowerCase && passwordRules.number && passwordRules.special;
        if (!name) {
            newErrors.name = "Name is required.";
            return false;
        }
        if (name.length < 3) {
            newErrors.name = "Minimum 3 characters required.";
            return false;
        }
        if (name.length > 50) {
            newErrors.name = "Maximum 50 characters allowed.";
            return false;
        }
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!email) {
            newErrors.email = "Email is required.";
            return false;
        }
        if (!emailRegex.test(email)) {
            newErrors.email = "Enter a valid email address.";
            return false;
        }
        if (!isPasswordValid) {
            newErrors.password = "Password does not satisfy all rules.";
            return false;
        }
        if (!userForm.role) {
            newErrors.role = "Role is required.";
            return false;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const resetUserForm = () => {
        setUserForm({
            name: "",
            email: "",
            password: "",
            role: USER_ROLE.RECEPTIONIST
        });
        setErrors({
            name: "",
            email: "",
            password: "",
            role: ""
        });
    };
    const handleDeactivateClick = (user) => {
        setSelectedUser(user);
        setShowDeactivateModal(true);
    };
    const handleDeactivateUser = async () => {
        if (!selectedUser) return;
        setDeleting(true);
        try {
            const response = await apiRequest(`/api/users/${selectedUser.id}`, {
                method: "DELETE"
            });
            await handleApiResponse(response);
            toast.success("User deactivated successfully.");
            setShowDeactivateModal(false);
            setSelectedUser(null);
            await fetchUsers();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setDeleting(false);
        }
    };
    const handleExportUsers = async () => {
        try {
            setExporting(true);
            const params = new URLSearchParams();
            if (search.trim()) {
                params.append("search", search);
            }
            if (selectedRole) {
                params.append("role", selectedRole);
            }
            if (selectedStatus !== "") {
                params.append("active", selectedStatus);
            }
            const response = await apiRequest(`/api/users/export?${params}`);
            await handleApiResponse(response);
            const data = await response.json();
            if (!data || data.length === 0) {
                toast.warning("No users found.");
                return;
            }
            const headers = ["ID", "Name", "Email", "Role", "Status", "Created At"];
            const rows = data.map(user => [user.id, user.name, user.email, user.role, user.status, user.createdAt]);
            let fileName = "fitzone_users";
            if (selectedRole) {
                fileName += `_${selectedRole.toLowerCase()}`;
            }
            fileName += `_${new Date().toISOString().split("T")[0]}.csv`;
            exportToCsv(headers, rows, fileName);
            toast.success("Users exported successfully.");
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setExporting(false);
        }
    };
    return (
        <AdminLayout>
            <div className="header-card">
                <div>
                    <p className="admin-label"> ADMIN PANEL</p>
                    <h1 className="dashboard-title">User Management</h1>
                    <p className="dashboard-subtitle"> Manage FitZone Users</p>
                </div>
                <div>
                    <button className="add-customer-btn" onClick={() => { resetUserForm(); setShowCreateModal(true) }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        Create User</button>
                </div>
            </div>
            {/*Search and Filter*/}
            <div className="search-filter-container">
                <input type="text" placeholder="Search User..." className="search-input" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} />
                <select value={selectedRole} onChange={(e) => { setSelectedRole(e.target.value); setPage(0); }} className="filter-select">
                    <option value="">👥 All Roles</option>
                    <option value="ADMIN">Administrator</option>
                    <option value="RECEPTIONIST">Receptionist</option>
                    <option value="TRAINER">Trainer</option>
                </select>
            </div>
            <div className="search-filter-container">
                <select value={selectedStatus} onChange={(e) => { setSelectedStatus(e.target.value); setPage(0); }} className="filter-select">
                    <option value="">📌 All Status</option>
                    <option value="true">🟢 Active</option>
                    <option value="false">🔴 Inactive</option>
                </select>
                <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(0); }} className="filter-select">
                    <option value="createdAt">📅 Created Date</option>
                    <option value="name">👤 Name</option>
                    <option value="email">📧 Email</option>
                    <option value="role">🛡️ Role</option>
                </select>
                <select value={sortDir} onChange={(e) => { setSortDir(e.target.value); setPage(0); }} className="filter-select">
                    <option value="desc">⬇️ Newest First</option>
                    <option value="asc">⬆️ Oldest First</option>
                </select>
            </div>
            {/*User Management Table*/}
            <div className="table-top">
                <div className="table-summary"> Total Users: {totalRecords}</div>
                <div>
                    <button className="export-btn" title="Export Users to Excel" onClick={handleExportUsers}> <FileSpreadsheet color="#30c40f" size={24} strokeWidth={2} /></button>
                    <button className="refresh-btn" onClick={resetFilters}> <RefreshCcw color="#2563EB" size={24} strokeWidth={2} /> </button>
                </div>
            </div>
            <div className="table-wrapper">
                <table className="customer-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableLoading ? (
                            <tr>
                                <td colSpan="6" className="table-loader">
                                    <Loader />
                                </td>
                            </tr>
                        ) : users.length === 0 ? (<tr>
                            <td colSpan="5">
                                <EmptyState title="No User Found" description="There is no data to display in this table at the moment. New entries will appear here automatically." />
                            </td>
                        </tr>
                        ) : users.map(user => (
                            <tr key={user.id} onClick={() => navigate(`/admin/users/${user.id}`)}>
                                <td data-label="Name">{user.name}</td>
                                <td data-label="Email">{user.email}</td>
                                <td data-label="Role"> <span className="role-badge"> {user.role} </span></td>
                                <td data-label="Status"> <span className={user.active ? "status-active" : "status-inactive"}> {user.active ? "Active" : "Inactive"}</span></td>
                                <td data-label="Actions">
                                    <div className="icon-btn">
                                        <button className="delete-icn" onClick={() => handleDeactivateClick(user)}><UserX size={24} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
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
            {/*Add User Modal*/}
            {showCreateModal && (<FormModal title="Add User" onClose={() => { resetUserForm(); setShowCreateModal(false); }} loading={saving} onSubmit={handleCreateUser} buttonText="Add User">
                <input type="text" name="name" placeholder="Full Name" maxLength={50} className={`search-input ${errors.name ? "input-error" : ""}`} value={userForm.name} onChange={handleChange} />
                {errors.name && <p className="field-error"> {errors.name} </p>}
                <input type="email" name="email" placeholder="Email Address" maxLength={100} className={`search-input ${errors.email ? "input-error" : ""}`} value={userForm.email} onChange={handleChange} />
                {errors.email && <p className="field-error"> {errors.email} </p>}
                <div className="password-wrapper">
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="search-input" autoComplete="new-password" value={userForm.password} onChange={handleChange} />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} > {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
                {errors.password && <p className="field-error">     {errors.password} </p>}
                <div className="password-rules">
                    <PasswordRule valid={passwordRules.minLength} text="Minimum 8 characters" />
                    <PasswordRule valid={passwordRules.upperCase} text="One uppercase letter" />
                    <PasswordRule valid={passwordRules.lowerCase} text="One lowercase letter" />
                    <PasswordRule valid={passwordRules.number} text="One number" />
                    <PasswordRule valid={passwordRules.special} text="One special character" />
                </div>
                <select name="role" value={userForm.role} className={`filter-select-modal ${errors.role ? "input-error" : ""}`} onChange={handleChange}>
                    <option value={USER_ROLE.RECEPTIONIST}>Receptionist</option>
                    <option value={USER_ROLE.TRAINER}>Trainer</option>
                </select>
                {errors.role && <p className="field-error">     {errors.role} </p>}
            </FormModal>
            )}
            {/*Deactivate User Modal*/}
            {showDeactivateModal && (<ConfirmModal title="Deactivate User" description="Are you sure you want to deactivate this user? This user will no longer be able to log in." onClose={() => setShowDeactivateModal(false)} onConfirm={handleDeactivateUser} loading={deleting} />)}
        </AdminLayout>
    );
}