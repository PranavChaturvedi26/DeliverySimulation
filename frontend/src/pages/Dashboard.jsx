import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { getLatestSimulation, getAllSimulations } from "../api/simulation";
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
    const [latestSimulation, setLatestSimulation] = useState(null);
    const [allSimulations, setAllSimulations] = useState([]);
    const [error, setError] = useState("");

    const fetchData = async () => {
        const testBackendConnection = async () => {
            try {
                await api.get("/api/auth/me");
            } catch (err) {
                if (err.response?.status !== 401) {
                    console.error("Backend connectivity test failed:", err);
                    setError("Cannot connect to backend server. Please ensure backend is running on port 5000");
                    return;
                }
            }
        };

        const fetchLatestSimulation = async () => {
            try {
                const res = await getLatestSimulation();
                setLatestSimulation(res.data);
                setError("");
            } catch (err) {
                console.error("Error fetching latest simulation:", err);
                setError(
                    err.response?.status === 401
                        ? "You must be logged in to view simulation data"
                        : "Failed to fetch latest simulation data"
                );
            }
        };

        const fetchAllSimulations = async () => {
            try {
                const res = await getAllSimulations();
                setAllSimulations(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Error fetching all simulations:", err);
                setError(
                    err.response?.status === 401
                        ? "You must be logged in to view simulation data"
                        : "Failed to fetch simulation history"
                );
            }
        };

        await testBackendConnection();
        if (!error) {
            await fetchLatestSimulation();
            await fetchAllSimulations();
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const handleFocus = () => {
            fetchData();
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const deliveryData = latestSimulation
        ? [
            { name: "On-time", value: latestSimulation.onTimeDeliveries || 0 },
            { name: "Late", value: latestSimulation.lateDeliveries || 0 },
        ]
        : [
            { name: "On-time", value: 0 },
            { name: "Late", value: 0 },
        ];

    const fuelData = latestSimulation
        ? [{ name: "Fuel Cost (Rs.)", cost: latestSimulation.fuelCost || 0 }]
        : [{ name: "Fuel Cost (Rs.)", cost: 0 }];

    const COLORS = ["#10B981", "#EF4444"];

    const allSimulationsWithLatest = latestSimulation
        ? [latestSimulation, ...allSimulations.filter(sim => sim._id !== latestSimulation._id)]
        : allSimulations;

    // ✅ Create unique name for chart data but keep clean date for axis
    const simulationsHistory = allSimulationsWithLatest
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .reverse()
        .map((sim, index) => {
            const dateObj = new Date(sim.createdAt);
            return {
                id: sim._id,
                name: `${dateObj.toLocaleDateString()} #${index + 1}`, // Make each name unique
                uniqueName: `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, // for uniqueness
                profit: Number(sim.totalProfit || 0),
                efficiency: Number(sim.efficiencyScore || 0),
            };
        });

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-xl font-semibold mb-2">Error</div>
                    <div className="text-gray-600">{error}</div>
                </div>
            </div>
        );
    }

    if (!latestSimulation) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-gray-600 text-xl font-semibold mb-2">No Simulation Data Available</div>
                    <div className="text-gray-500">
                        Run a simulation first to see KPI metrics and charts.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500">Total Profit</h3>
                        <p className="text-2xl font-bold text-green-600">
                            ₹{(latestSimulation.totalProfit || 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500">Efficiency Score</h3>
                        <p className="text-2xl font-bold text-blue-600">
                            {(latestSimulation.efficiencyScore || 0).toFixed(1)}%
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500">On-time Deliveries</h3>
                        <p className="text-2xl font-bold text-green-600">
                            {latestSimulation.onTimeDeliveries || 0}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500">Late Deliveries</h3>
                        <p className="text-2xl font-bold text-red-600">
                            {latestSimulation.lateDeliveries || 0}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Performance</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={deliveryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {deliveryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fuel Cost Breakdown</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={fuelData}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="cost" fill="#3B82F6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Simulation History</h3>

                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={simulationsHistory} key={simulationsHistory.length}>
                            <XAxis
                                dataKey="name"
                                tickFormatter={(val) => val.split(" #")[0]} // only date on axis, hide the #1, #2, etc.
                            />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload?.length) {
                                        const d = payload[0].payload;

                                        return (
                                            <div className="bg-white p-3 border border-gray-200 rounded shadow">
                                                <p className="font-medium">{d.name.split(" #")[0]}</p>
                                                <p style={{ color: '#10B981' }}>Profit (Rs.): ₹{d.profit}</p>
                                                <p style={{ color: '#3B82F6' }}>Efficiency (%): {d.efficiency}%</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend />
                            <Bar yAxisId="left" dataKey="profit" fill="#10B981" name="Profit (Rs.)" />
                            <Bar yAxisId="right" dataKey="efficiency" fill="#3B82F6" name="Efficiency (%)" />
                        </BarChart>
                    </ResponsiveContainer>

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
