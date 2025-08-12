import React, { useState, useEffect } from "react";
import { getRoutes, createRoute, updateRoute, deleteRoute } from "../api/routes";

const Routes = () => {
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);
    const [formData, setFormData] = useState({
        route_id: "",
        distance_km: "",
        traffic_level: "Low",
        base_time_min: ""
    });

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            setLoading(true);
            const response = await getRoutes();
            setRoutes(response.data);
            setError("");
        } catch (err) {
            setError("Failed to fetch routes");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingRoute) {
                await updateRoute(editingRoute._id, formData);
                setEditingRoute(null);
            } else {
                await createRoute(formData);
            }
            setShowForm(false);
            resetForm();
            fetchRoutes();
        } catch (err) {
            setError("Failed to save route");
            console.error(err);
        }
    };

    const handleEdit = (route) => {
        setEditingRoute(route);
        setFormData({
            route_id: route.route_id,
            distance_km: route.distance_km,
            traffic_level: route.traffic_level,
            base_time_min: route.base_time_min
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this route?")) {
            try {
                await deleteRoute(id);
                fetchRoutes();
            } catch (err) {
                setError("Failed to delete route");
                console.error(err);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            route_id: "",
            distance_km: "",
            traffic_level: "Low",
            base_time_min: ""
        });
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingRoute(null);
        resetForm();
    };

    if (loading) return <div className="p-6">Loading routes...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Routes Management</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add New Route
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Route Form */}
            {showForm && (
                <div className="bg-white rounded shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingRoute ? "Edit Route" : "Add New Route"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Route ID</label>
                            <input
                                type="number"
                                value={formData.route_id}
                                onChange={(e) => setFormData({ ...formData, route_id: Number(e.target.value) })}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Distance (km)</label>
                            <input
                                type="number"
                                value={formData.distance_km}
                                onChange={(e) => setFormData({ ...formData, distance_km: Number(e.target.value) })}
                                className="w-full border rounded px-3 py-2"
                                step="0.1"
                                min="0"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Traffic Level</label>
                            <select
                                value={formData.traffic_level}
                                onChange={(e) => setFormData({ ...formData, traffic_level: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                required
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Base Time (minutes)</label>
                            <input
                                type="number"
                                value={formData.base_time_min}
                                onChange={(e) => setFormData({ ...formData, base_time_min: Number(e.target.value) })}
                                className="w-full border rounded px-3 py-2"
                                min="0"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                {editingRoute ? "Update" : "Create"}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Routes Table */}
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Route ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Distance (km)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Traffic Level
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Base Time (min)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {routes.map((route) => (
                            <tr key={route._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {route.route_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {route.distance_km} km
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${route.traffic_level === 'High' ? 'bg-red-100 text-red-800' :
                                            route.traffic_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                        }`}>
                                        {route.traffic_level}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {route.base_time_min} min
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(route)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(route._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Routes;
