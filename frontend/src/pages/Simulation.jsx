import React, { useState, useEffect } from "react";
import { runSimulation } from "../api/simulation";
import { getDrivers } from "../api/drivers";

const Simulation = () => {
    const [drivers, setDrivers] = useState([]);
    const [selectedDriverIds, setSelectedDriverIds] = useState(new Set());
    const [startTime, setStartTime] = useState("");
    const [maxHours, setMaxHours] = useState("");
    const [simulationResult, setSimulationResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const res = await getDrivers();
                setDrivers(Array.isArray(res.data) ? res.data : []);
                setSelectedDriverIds(new Set(res.data.map(d => d._id || d.id)));
                setError("");
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError("You must be logged in to fetch drivers");
                } else {
                    setError("Failed to fetch drivers");
                }
                console.error(err);
            }
        };

        fetchDrivers();
    }, []);

    const toggleDriverSelection = (driverId) => {
        setSelectedDriverIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(driverId)) newSet.delete(driverId);
            else newSet.add(driverId);
            return newSet;
        });
    };

    const handleRunSimulation = async () => {
        if (!startTime || !maxHours || selectedDriverIds.size === 0) {
            setError("Please fill in all fields and select at least one driver");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await runSimulation({
                numDrivers: selectedDriverIds.size,
                startTime: startTime,
                maxHoursPerDriver: parseInt(maxHours)
            });

            setSimulationResult(res.data);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError("You must be logged in to run simulations");
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Failed to run simulation");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const formatTime = (timeString) => {
        return new Date(timeString).toLocaleString('en-IN');
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Delivery Simulation</h1>

                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Simulation Parameters</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Start Time
                            </label>
                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Max Hours Per Driver
                            </label>
                            <input
                                type="number"
                                value={maxHours}
                                onChange={(e) => setMaxHours(e.target.value)}
                                min="1"
                                max="24"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Drivers ({selectedDriverIds.size} selected)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                            {drivers.map((driver) => (
                                <label key={driver._id} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedDriverIds.has(driver._id)}
                                        onChange={() => toggleDriverSelection(driver._id)}
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-sm text-gray-700">{driver.name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleRunSimulation}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? "Running Simulation..." : "Run Simulation"}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Error</h3>
                                <div className="mt-2 text-sm text-red-700">{error}</div>
                            </div>
                        </div>
                    </div>
                )}

                {simulationResult && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Simulation Results</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-green-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-green-800">Total Profit</h3>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(simulationResult.totalProfit)}
                                </p>
                            </div>
                            
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-blue-800">Efficiency Score</h3>
                                <p className="text-2xl font-bold text-blue-600">
                                    {simulationResult.efficiencyScore.toFixed(1)}%
                                </p>
                            </div>
                            
                            <div className="bg-green-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-green-800">On-time Deliveries</h3>
                                <p className="text-2xl font-bold text-green-600">
                                    {simulationResult.onTimeDeliveries}
                                </p>
                            </div>
                            
                            <div className="bg-red-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-red-800">Late Deliveries</h3>
                                <p className="text-2xl font-bold text-red-600">
                                    {simulationResult.lateDeliveries}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-800 mb-2">Simulation Details</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Number of Drivers:</span>
                                        <span className="font-medium">{simulationResult.numDrivers}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Start Time:</span>
                                        <span className="font-medium">{formatTime(simulationResult.startTime)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Max Hours Per Driver:</span>
                                        <span className="font-medium">{simulationResult.maxHoursPerDriver}h</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-800 mb-2">Cost Breakdown</h3>
                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <span>Fuel Cost:</span>
                                        <span className="font-medium">{formatCurrency(simulationResult.fuelCost)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Total Deliveries:</span>
                                        <span className="font-medium">
                                            {simulationResult.onTimeDeliveries + simulationResult.lateDeliveries}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {drivers.length === 0 && !loading && (
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Drivers Available</h3>
                        <p className="text-gray-500 mb-4">
                            You need to add drivers first before running simulations.
                        </p>
                        <button
                            onClick={() => window.location.href = '/drivers'}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Go to Drivers Page
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Simulation;
