const BASE_URL = "http://localhost:8080";

export async function apiRequest(endpoint,options = {}) {
    const token = localStorage.getItem("token");
    const headers = { "Content-Type": "application/json", ...options.headers};
    if (token) {
        headers.Authorization =
            `Bearer ${token}`;
    }
    const response = await fetch(`${BASE_URL}${endpoint}`,{...options,headers});
    if (response.status === 401 || response.status === 403) {
        window.dispatchEvent(new Event("session-expired"));
    }
    return response;
}