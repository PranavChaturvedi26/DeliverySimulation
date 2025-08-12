import api from "../utils/api";

export async function registerUser(userData) {
    try {
        const res = await api.post("/api/auth/register", userData);
        // Expecting backend to return user info (no token, since token in cookie)
        return res.data;
    } catch (error) {
        // Try to get meaningful message from backend
        const message =
            error.response?.data?.message || error.message || "Failed to register";
        throw new Error(message);
    }
}

export async function loginUser(credentials) {
    try {
        const response = await api.post("/api/auth/login", credentials);
        return response.data; // { user: {...} }
    } catch (error) {
        const message =
            error.response?.data?.message || error.message || "Login failed";
        throw new Error(message);
    }
}

export async function logoutUser() {
    try {
        await api.post("/api/auth/logout");
    } catch (error) {
        const message =
            error.response?.data?.message || error.message || "Logout failed";
        throw new Error(message);
    }
}
