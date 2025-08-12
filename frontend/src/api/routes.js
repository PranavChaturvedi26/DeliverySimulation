import api from "../utils/api";

export const getRoutes = () => api.get("/api/routes");
export const getRoute = (id) => api.get(`/api/routes/${id}`);
export const createRoute = (data) => api.post("/api/routes", data);
export const updateRoute = (id, data) => api.put(`/api/routes/${id}`, data);
export const deleteRoute = (id) => api.delete(`/api/routes/${id}`);
