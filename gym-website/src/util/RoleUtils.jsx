import { getUserDetails } from "./AuthUtils";

export const getRole = () => {
    const user = getUserDetails();
    return user?.role || "";
};

export const getUserName = () => {
    const user = getUserDetails();
    return user?.name || "";
};

export const getUserEmail = () => {
    const user = getUserDetails();
    return user?.email || "";
};

export const getCurrentUser = () => {
    return getUserDetails();
};

export const isAdmin = () => getRole() === "ADMIN";

export const isReceptionist = () => getRole() === "RECEPTIONIST";

export const isTrainer = () => getRole() === "TRAINER";

export const hasRole = (role) => getRole() === role;

export const hasAnyRole = (roles) => roles.includes(getRole());