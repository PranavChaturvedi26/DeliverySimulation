import api from "../utils/api";

export const runSimulation = (data) => api.post("/api/simulation", data);
export const getLatestSimulation = () => api.get("/api/simulation/latest");
export const getAllSimulations = () => api.get("/api/simulation");
export const createSampleSimulations = () => api.post("/api/simulation/sample");
