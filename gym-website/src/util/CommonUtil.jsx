import { APP_CONFIG } from "../constants/AppConstants";
export const formatCurrency = (amount) => {
    const numericAmount = Number(String(amount).replace(/[^\d.-]/g, ""));
    return `${APP_CONFIG.CURRENCY_SYMBOL}${numericAmount.toLocaleString(APP_CONFIG.LOCALE)}`;
};
export const getAmountValue = (amount) => {
    return Number(String(amount).replace(/[^\d.-]/g, "")) || 0;
};
export const formatDate = (dateString) => {
    if (!dateString) {
        return "-";
    }
    return new Date(dateString).toLocaleDateString(APP_CONFIG.LOCALE);
};
export const formatDateTime = (dateString) => {
    if (!dateString) {
        return "-";
    }
    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    const formatter = new Intl.DateTimeFormat(navigator.language, options);
    const formattedDateTime = formatter.format(date);
    return formattedDateTime;
}
export const getMembershipStatus = (customer) => {
    if (customer.status === "INACTIVE") {
        return { text: "Inactive", category: "INACTIVE", className: "inactive-status" };
    }
    const today = new Date();
    const expiry = new Date(customer.expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
        return { text: "Expired", category: "EXPIRED", className: "expired-status" };
    }
    if (diffDays <= 3) {
        return { text: `Expiring in ${diffDays} day${diffDays > 1 ? "s" : ""}`, category: "EXPIRING", className: "expiring-urgent-status" };
    }
    if (diffDays <= 7) {
        return { text: "Expiring Soon", category: "EXPIRING", className: "expiring-status" };
    }
    return { text: "Active", category: "ACTIVE", className: "active-status" };
};