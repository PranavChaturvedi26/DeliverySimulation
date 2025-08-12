import axios from "axios";

// Use deployed backend URL for production, localhost for development
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://purplemeritassessment.onrender.com',
    timeout: 10000,
    withCredentials: true, // Always send cookies with requests
});

export default api;
