import "../style/Admin.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Mail, Shield, User, CalendarDays, Clock, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { apiRequest, handleApiResponse } from "../util/api";
import { toast } from "react-toastify";
import AdminLayout from "../components/layout/AdminLayout";
import { formatDateTime } from "../util/CommonUtil";
import { AdminSidebar, Loader, DetailItem, EmptyState, PasswordRule } from "../components/common/index";
import { FormModal } from "../components/modals/index";
import { USER_ROLE } from "../constants/AppConstants";

export default function UserDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activities, setActivities] = useState([]);
    const [activityLoading, setActivityLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const BASE_URL = import.meta.env.VITE_API_LOCALURL;
    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "RECEPTIONIST"
    });
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        role: ""
    });
    const passwordRules = {
        minLength: userForm.password.length >= 8,
        upperCase: /[A-Z]/.test(userForm.password),
        lowerCase: /[a-z]/.test(userForm.password),
        number: /\d/.test(userForm.password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(userForm.password)
    };

    useEffect(() => {
        fetchUserDetails();
        fetchUserActivities();
    }, [id]);
    const fetchUserDetails = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await apiRequest(`/api/users/${id}`);
            await handleApiResponse(response);
            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error("Error fetching user details:", error);
            setError(error.message || "Unable to load user details.");
        } finally {
            setLoading(false);
        }
    };
    const fetchUserActivities = async () => {
        try {
            setActivityLoading(true);
            const response = await apiRequest(`/api/users/${id}/activities`);
            await handleApiResponse(response);
            const data = await response.json();
            setActivities(data || []);
        } catch (error) {
            console.error("Error fetching user activities:", error);
            toast.error(error.message || "Unable to load user activity.");
        } finally {
            setActivityLoading(false);
        }
    };
    const handleEditUser = (user) => {
        setIsEditMode(true);
        setSelectedUserId(user.id);
        setUserForm({
            name: user.name,
            email: user.email,
            password: "",
            role: user.role
        });
        setShowEditModal(true);
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
    const resetUserForm = () => {
        setIsEditMode(false);
        setSelectedUserId(null);
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
    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!validateUserForm()) return;
        setSaving(true);
        try {
            const payload = {
                name: userForm.name.trim(),
                email: userForm.email.trim().toLowerCase(),
                role: userForm.role
            };
            const response = await apiRequest(`/api/users/${selectedUserId}`, {
                method: "PUT",
                body: JSON.stringify(payload)
            });
            await handleApiResponse(response);
            toast.success("User updated successfully.");
            resetUserForm();
            setShowEditModal(false);
            await fetchUserActivities();
            await fetchUserDetails();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setSaving(false);
        }
    };
    const uploadUserImage = async () => {
        if (!selectedImage) {
            toast.error("Please select an image");
            return;
        }
        try {
            setUploadingImage(true);
            const formData = new FormData();
            formData.append("file", selectedImage);
            const token = sessionStorage.getItem("token");
            const response = await fetch(
                `${BASE_URL}/api/users/${user.id}/upload-image`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                }
            );
            await handleApiResponse(response);
            toast.success("Profile image uploaded successfully");
            setSelectedImage(null);
            setShowImageModal(false);
            await fetchUserDetails();
            await fetchUserActivities();
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        } finally {
            setUploadingImage(false);
        }
    };
    const closeImageModal = () => {
        setSelectedImage(null);
        setShowImageModal(false);
    };
    if (loading) {
        return (
            <AdminLayout>
                <Loader />
            </AdminLayout>
        );
    };
    return (
        <AdminLayout>
            <div className="header-card">
                <div>
                    <p className="admin-label"> ADMIN PANEL</p>
                    <h1 className="dashboard-title">User Overview</h1>
                    <p className="dashboard-subtitle"> View and manage user details </p>
                </div>
                <button className="btn-primary" onClick={(e) => { handleEditUser(user); }}> <Edit size={17} className="btn-icon" /> Edit User </button>
            </div>
            {/* User Profile */}
            <div className="user-details-grid">
                <div className="user-profile-card">
                    <div className="user-profile-header">
                        <div className="user-avatar"> 
                            {user.profileImageUrl ? ( <img src={`${BASE_URL}${user.profileImageUrl}`} alt={user.name} className="user-profile-image" />) : (
                                <div className="user-profile-placeholder"> {user.name?.charAt(0).toUpperCase()}</div>)} 
                        </div>
                        <div className="profile-info">
                            <h1>{user.name}</h1>
                            <p className="user-id"> User ID : #{user.id}</p>
                            <div className="profile-badges">
                                <span className="role-badge"> {user.role} </span>
                            </div>
                        </div>
                    </div>
                    <div className="user-status-wrapper">
                        {user.active ? (<span className="status-badge active"><CheckCircle2 size={15} /> Active </span>) : (
                            <span className="status-badge inactive"> <XCircle size={15} /> Inactive </span>)}
                    </div>
                    <div className="user-image-btn-div">
                        <button className="img-upload-btn" onClick={() => setShowImageModal(true)} > Upload Image</button>
                    </div>
                </div>
                {/* Account Information */}
                <div className="user-information-card">
                    <h3>Account Information</h3>
                    <div className="user-information-grid">
                        <div className="user-information-item">
                            <User size={18} />
                            <div> <span>Name</span> <strong>{user.name}</strong> </div>
                        </div>
                        <div className="user-information-item">
                            <Shield size={18} />
                            <div> <span>Role</span> <strong>{user.role}</strong> </div>
                        </div>
                        <div className="user-information-item">
                            <CalendarDays size={18} />
                            <div> <span>Created</span> <strong>{formatDateTime(user.createdAt)} </strong> </div>
                        </div>
                        <div className="user-information-item">
                            <Clock size={18} />
                            <div> <span>Last Updated</span> <strong>{formatDateTime(user.updatedAt)} </strong>
                            </div>
                        </div>
                        <div className="user-information-item">
                            <Mail size={18} />
                            <div> <span>Email</span> <strong>{user.email}</strong> </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="user-image-card">
                <h3>Image Information</h3>
                <div className="image-row">
                    <span>Updated By</span>
                    <strong> {user.imageUpdatedBy || "-"} </strong>
                </div>
                <div className="details-row">
                    <span>Updated At</span>
                    <strong> {user.imageUpdatedAt ? formatDateTime(user.imageUpdatedAt) : "-"} </strong>
                </div>
            </div>
            {/* Activity Section - Coming Next */}
            <div className="user-activity-card">
                <div>
                    <h3>Recent Activity</h3>
                    <p>History of actions performed on this account</p>
                </div>
            </div>
            <div className="user-activity-timeline">
                {activityLoading ? (<div className="activity-loading"> Loading activity...</div>) : activities.length === 0 ? (
                    <div className="empty-state-small">
                        <p>No activity found for this user.</p>
                    </div>) : (
                    <div className="activity-timeline">
                        {activities.map((activity) => (
                            <div className="activity-item" key={activity.id}>
                                <div className="activity-timeline-line">
                                    <div className="activity-dot" />
                                </div>
                                <div className="activity-content">
                                    <div className="activity-top-row">
                                        <span className="activity-type">  {activity.activityType} </span>
                                        <span className="activity-date"> {formatDateTime(activity.createdAt)} </span>
                                    </div>
                                    <p className="activity-description"> {activity.description}
                                    </p>
                                    <span className="activity-performed-by">  Performed by: {activity.performedBy} </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/*Edit User Modal*/}
            {showEditModal && (<FormModal title="Edit User" onClose={() => { resetUserForm(); setShowEditModal(false); }} loading={saving} onSubmit={handleUpdateUser} buttonText="Update User">
                <input type="text" name="name" placeholder="Full Name" maxLength={50} className={`search-input ${errors.name ? "input-error" : ""}`} value={userForm.name} onChange={handleChange} />
                {errors.name && <p className="field-error"> {errors.name} </p>}
                <input type="email" name="email" placeholder="Email Address" maxLength={100} className={`search-input ${errors.email ? "input-error" : ""}`} value={userForm.email} onChange={handleChange} />
                {errors.email && <p className="field-error"> {errors.email} </p>}
                <div className="password-wrapper">
                    <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="search-input" autoComplete="new-password" value={userForm.password} onChange={handleChange} />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)} > {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
                {errors.password && <p className="field-error"> {errors.password} </p>}
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
                {errors.role && <p className="field-error"> {errors.role} </p>}
            </FormModal>
            )}
            {/* Upload Image Modal */}
            {showImageModal && (<FormModal title="Upload User Image" onClose={closeImageModal} onSubmit={uploadUserImage} loading={uploadingImage} buttonText="Upload">
                <input type="file" accept="image/*" className="inputFile" onChange={(e) => setSelectedImage(e.target.files[0])} />
                {selectedImage && (<img src={URL.createObjectURL(selectedImage)} alt="Preview" className="image-preview" />)}
            </FormModal>
            )}
        </AdminLayout>
    );
}