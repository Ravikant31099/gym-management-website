import {getToken } from "../util/AuthUtils";
const BASE_URL = import.meta.env.VITE_API_LOCALURL;;

export async function apiRequest(endpoint,options = {}) {
    const token = getToken();;
    const headers = { "Content-Type": "application/json", ...options.headers};
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(`${BASE_URL}${endpoint}`,{...options,headers});
    if (response.status === 401 || response.status === 403) {
        window.dispatchEvent(new Event("session-expired"));
    }
    return response;
}
export async function handleApiResponse(response) {
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || "Something went wrong");
    }
    return response;

}