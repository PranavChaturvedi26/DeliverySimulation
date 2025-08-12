import api from "../utils/api";

export const getDrivers = () => api.get("/api/drivers");
export const getDriver = (id) => api.get(`/api/drivers/${id}`);
export const createDriver = (data) => api.post("/api/drivers", data);
export const updateDriver = (id, data) => api.put(`/api/drivers/${id}`, data);
export const deleteDriver = (id) => api.delete(`/api/drivers/${id}`);
