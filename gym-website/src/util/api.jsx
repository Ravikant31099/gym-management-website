import { getToken, clearToken, clearUserDetails } from "../util/AuthUtils";

const BASE_URL = import.meta.env.VITE_API_LOCALURL;

/**
 * Fixes vs. the audited version:
 *
 * 1. Content-Type was unconditionally forced to "application/json", including for
 *    FormData bodies (profile image uploads). A browser needs to set its own
 *    Content-Type for multipart/form-data (it must include a dynamically generated
 *    boundary string) — forcing "application/json" on a FormData body would silently
 *    corrupt the multipart request on any caller that used apiRequest() for uploads,
 *    which is exactly why CustomerDetails.jsx/UserDetails.jsx worked around this bug by
 *    bypassing apiRequest() entirely and hand-rolling a raw fetch() call for uploads —
 *    duplicating token retrieval and losing the 401/403 session-expired handling in the
 *    process. This fix detects FormData bodies and omits Content-Type so the browser
 *    sets it correctly, which means uploads can now go through apiRequest() like every
 *    other request (see the updated CustomerDetails.jsx/UserDetails.jsx in the next
 *    batch).
 * 2. On a 401/403 with a token present, the stale token is now actively cleared
 *    (clearToken/clearUserDetails) before dispatching "session-expired" — previously
 *    the token was left in sessionStorage, so if the "session-expired" listener's
 *    redirect logic ever raced with another in-flight request, that request could still
 *    read and send the known-invalid token.
 * 3. A default 15s timeout via AbortController, unless the caller supplies their own
 *    `signal` — the original had no timeout at all, so a hung backend/network could
 *    leave a request (and its "loading" state in the calling component) pending
 *    indefinitely.
 */
const DEFAULT_TIMEOUT_MS = 15000;

export async function apiRequest(endpoint, options = {}) {
	const token = getToken();
	const isFormData = options.body instanceof FormData;

	const headers = { ...options.headers };
	if (!isFormData && !("Content-Type" in headers)) {
		headers["Content-Type"] = "application/json";
	}
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const controller = new AbortController();
	const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);
	const signal = options.signal ?? controller.signal;

	try {
		const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers, signal });
		if (response.status === 401 && token) {
			clearToken();
			clearUserDetails();
			window.dispatchEvent(new Event("session-expired"));
		}
		return response;
	} catch (error) {
		if (error.name === "AbortError") {
			throw new Error("Request timed out. Please check your connection and try again.");
		}
		throw error;
	} finally {
		clearTimeout(timeoutId);
	}
}

export async function handleApiResponse(response) {
	if (!response.ok) {
		let errorMessage = `Status ${response.status}: ${response.statusText}`;
		try {
			const errorData = await response.json();
			const parts = [errorData.error, errorData.message].filter(
				(part) => typeof part === "string" && part.trim().length > 0
			);
			if (parts.length > 0) {
				errorMessage = parts.join(" : ");
			}
		} catch (e) {
			console.log(e);
		}
		throw new Error(errorMessage);
	}
	return response;
}