export const getToken = () => {
    return sessionStorage.getItem("token");
};
export const setToken = (token) => {
    sessionStorage.setItem("token", token);
};
export const clearToken = () => {
    sessionStorage.removeItem("token");
};
export const isAuthenticated = () => {
    return !!getToken();
};
export const setUserDetails = (data) => {
    sessionStorage.setItem("user", JSON.stringify(data));
};
export const getUserDetails = () => {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;

};
export const clearUserDetails = () => {
    sessionStorage.removeItem("user");
};

export const logout = () => {
    sessionStorage.clear();
};