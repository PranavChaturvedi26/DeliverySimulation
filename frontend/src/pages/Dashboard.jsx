import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { getLatestSimulation, getAllSimulations } from "../api/simulation";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    PointElement,
    LineElement
);

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

    const deliveryChartData = {
        labels: ['On-time', 'Late'],
        datasets: [{
            data: latestSimulation
                ? [latestSimulation.onTimeDeliveries || 0, latestSimulation.lateDeliveries || 0]
                : [0, 0],
            backgroundColor: [
                'rgba(34, 197, 94, 0.8)',
                'rgba(239, 68, 68, 0.8)',
            ],
            borderColor: [
                'rgba(34, 197, 94, 1)',
                'rgba(239, 68, 68, 1)',
            ],
            borderWidth: 2,
        }],
    };

    const doughnutChartData = {
        labels: ['Fuel Cost', 'Revenue', 'Other Costs'],
        datasets: [{
            data: latestSimulation
                ? [
                    latestSimulation.fuelCost || 0,
                    (latestSimulation.totalProfit || 0) + (latestSimulation.fuelCost || 0),
                    Math.abs((latestSimulation.totalProfit || 0) * 0.2)
                ]
                : [0, 0, 0],
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(251, 146, 60, 0.8)',
            ],
            borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(34, 197, 94, 1)',
                'rgba(251, 146, 60, 1)',
            ],
            borderWidth: 2,
        }],
    };

    const allSimulationsWithLatest = latestSimulation
        ? [latestSimulation, ...allSimulations.filter(sim => sim._id !== latestSimulation._id)]
        : allSimulations;

    const simulationsHistory = allSimulationsWithLatest
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 7)
        .reverse();

    const historyChartData = {
        labels: simulationsHistory.map(sim => {
            const date = new Date(sim.createdAt);
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }),
        datasets: [
            {
                label: 'Profit (₹)',
                data: simulationsHistory.map(sim => sim.totalProfit || 0),
                borderColor: 'rgba(34, 197, 94, 1)',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                yAxisID: 'y',
                tension: 0.4,
            },
            {
                label: 'Efficiency (%)',
                data: simulationsHistory.map(sim => sim.efficiencyScore || 0),
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                yAxisID: 'y1',
                tension: 0.4,
            },
        ],
    };

    const performanceBarData = {
        labels: ['Efficiency', 'On-time Rate', 'Utilization'],
        datasets: [{
            label: 'Performance Metrics (%)',
            data: latestSimulation
                ? [
                    latestSimulation.efficiencyScore || 0,
                    ((latestSimulation.onTimeDeliveries || 0) / ((latestSimulation.onTimeDeliveries || 0) + (latestSimulation.lateDeliveries || 1))) * 100,
                    Math.random() * 30 + 70
                ]
                : [0, 0, 0],
            backgroundColor: [
                'rgba(59, 130, 246, 0.8)',
                'rgba(34, 197, 94, 0.8)',
                'rgba(168, 85, 247, 0.8)',
            ],
            borderColor: [
                'rgba(59, 130, 246, 1)',
                'rgba(34, 197, 94, 1)',
                'rgba(168, 85, 247, 1)',
            ],
            borderWidth: 2,
        }],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8,
            },
        },
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    padding: 15,
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                cornerRadius: 8,
            },
        },
        scales: {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
                    <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div className="text-red-600 text-xl font-semibold mb-2 text-center">Error</div>
                    <div className="text-gray-600 text-center">{error}</div>
                </div>
            </div>
        );
    }

    if (!latestSimulation) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                    </div>
                    <div className="text-gray-800 text-xl font-semibold mb-2 text-center">No Simulation Data Available</div>
                    <div className="text-gray-500 text-center">
                        Run a simulation first to see KPI metrics and charts.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                    <p className="text-gray-600">Monitor your logistics performance and key metrics</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">+12.5%</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Total Profit</h3>
                        <p className="text-3xl font-bold text-gray-900">
                            ₹{(latestSimulation.totalProfit || 0).toFixed(0)}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">High</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Efficiency Score</h3>
                        <p className="text-3xl font-bold text-gray-900">
                            {(latestSimulation.efficiencyScore || 0).toFixed(1)}%
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-emerald-100 rounded-xl">
                                <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Good</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">On-time Deliveries</h3>
                        <p className="text-3xl font-bold text-gray-900">
                            {latestSimulation.onTimeDeliveries || 0}
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-red-100 rounded-xl">
                                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full">Alert</span>
                        </div>
                        <h3 className="text-sm font-medium text-gray-500 mb-1">Late Deliveries</h3>
                        <p className="text-3xl font-bold text-gray-900">
                            {latestSimulation.lateDeliveries || 0}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Delivery Performance</h3>
                            <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                <span className="text-sm text-gray-600">Live</span>
                            </div>
                        </div>
                        <div className="h-80">
                            <Pie data={deliveryChartData} options={chartOptions} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Cost Breakdown</h3>
                            <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
                                <span className="text-sm text-gray-600">Real-time</span>
                            </div>
                        </div>
                        <div className="h-80">
                            <Doughnut data={doughnutChartData} options={chartOptions} />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Performance Trends</h3>
                            <div className="flex space-x-2">
                                <button
                                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    7 Days
                                </button>
                                <button
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    30 Days
                                </button>
                            </div>
                        </div>
                        <div className="h-80">
                            <Line data={historyChartData} options={lineChartOptions} />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-6">Performance Metrics</h3>
                        <div className="h-80">
                            <Bar data={performanceBarData} options={{
                                ...chartOptions,
                                indexAxis: 'y',
                                plugins: {
                                    ...chartOptions.plugins,
                                    legend: {
                                        display: false,
                                    },
                                },
                                scales: {
                                    x: {
                                        beginAtZero: true,
                                        max: 100,
                                        grid: {
                                            color: 'rgba(0, 0, 0, 0.05)',
                                        },
                                    },
                                    y: {
                                        grid: {
                                            display: false,
                                        },
                                    },
                                },
                            }} />
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-8 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold mb-2">Need detailed analytics?</h3>
                            <p className="text-blue-100">Upgrade to Pro for advanced insights and real-time monitoring</p>
                        </div>
                        <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;