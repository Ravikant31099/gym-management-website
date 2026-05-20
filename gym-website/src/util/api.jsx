const BASE_URL = "http://localhost:8080";

export async function apiRequest(endpoint,options = {}) {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json", ...options.headers};
    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
    }
    const response = await fetch(`${BASE_URL}${endpoint}`,{...options,headers});
    if (response.status === 401) {
        localStorage.removeItem("token");
        alert("Session expired. Please login again.");
        window.location.href = "/login";
    }
    return response;
}