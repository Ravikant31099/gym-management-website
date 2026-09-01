export const getToken = () => {
	return sessionStorage.getItem("token");
};

export const setToken = (token) => {
	sessionStorage.setItem("token", token);
};

export const clearToken = () => {
	sessionStorage.removeItem("token");
};

export const isTokenExpired = () => {
	const token = getToken();
	if (!token) {
		return true;
	}
	try {
		const payloadBase64 = token.split(".")[1];
		if (!payloadBase64) {
			return true;
		}
		const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
		const payload = JSON.parse(atob(normalized));
		if (!payload.exp) {
			return false;
		}
		return Date.now() >= payload.exp * 1000;
	} catch (e) {
		return true;
	}
};

export const isAuthenticated = () => {
	return !!getToken() && !isTokenExpired();
};

export const setUserDetails = (data) => {
	sessionStorage.setItem("user", JSON.stringify(data));
};

export const getUserDetails = () => {
	const user = sessionStorage.getItem("user");
	try {
		return user ? JSON.parse(user) : null;
	} catch (e) {
		return null;
	}
};

export const clearUserDetails = () => {
	sessionStorage.removeItem("user");
};

export const logout = () => {
	sessionStorage.clear();
};