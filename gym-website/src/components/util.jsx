const Baseurl = "http://localhost:8080";

export async function apiRequest(endpoint,options = {}) {
    const token = localStorage.getItem("token");
     const response = await fetch(
        `${BASE_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Authorization:
                    `Bearer ${token}`,
                ...options.headers
            }
        }
    );
    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
    }
    return response;
}