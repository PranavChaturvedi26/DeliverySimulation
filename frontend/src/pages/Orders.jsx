import React, { useState, useEffect } from "react";
import { getOrders, createOrder, updateOrder, deleteOrder } from "../api/orders";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [formData, setFormData] = useState({
        order_id: "",
        value_rs: "",
        route_id: "",
        delivery_time: ""
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getOrders();
            setOrders(response.data);
            setError("");
        } catch (err) {
            setError("Failed to fetch orders");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingOrder) {
                await updateOrder(editingOrder._id, formData);
                setEditingOrder(null);
            } else {
                await createOrder(formData);
            }
            setShowForm(false);
            resetForm();
            fetchOrders();
        } catch (err) {
            setError("Failed to save order");
            console.error(err);
        }
    };

    const handleEdit = (order) => {
        setEditingOrder(order);
        setFormData({
            order_id: order.order_id,
            value_rs: order.value_rs,
            route_id: order.route_id,
            delivery_time: order.delivery_time
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await deleteOrder(id);
                fetchOrders();
            } catch (err) {
                setError("Failed to delete order");
                console.error(err);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            order_id: "",
            value_rs: "",
            route_id: "",
            delivery_time: ""
        });
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingOrder(null);
        resetForm();
    };

    if (loading) return <div className="p-6">Loading orders...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Orders Management</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add New Order
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Order Form */}
            {showForm && (
                <div className="bg-white rounded shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingOrder ? "Edit Order" : "Add New Order"}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Order ID</label>
                            <input
                                type="number"
                                value={formData.order_id}
                                onChange={(e) => setFormData({ ...formData, order_id: Number(e.target.value) })}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Value (₹)</label>
                            <input
                                type="number"
                                value={formData.value_rs}
                                onChange={(e) => setFormData({ ...formData, value_rs: Number(e.target.value) })}
                                className="w-full border rounded px-3 py-2"
                                step="0.01"
                                min="0"
                                required
                            />
                        </div>
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
                            <label className="block text-sm font-medium mb-1">Delivery Time</label>
                            <input
                                type="datetime-local"
                                value={formData.delivery_time}
                                onChange={(e) => setFormData({ ...formData, delivery_time: e.target.value })}
                                className="w-full border rounded px-3 py-2"
                                required
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                {editingOrder ? "Update" : "Create"}
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

            {/* Orders Table */}
            <div className="bg-white rounded shadow overflow-hidden">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value (₹)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Route ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Delivery Time
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.order_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ₹{order.value_rs}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {order.route_id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.delivery_time).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(order)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(order._id)}
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

export default Orders;
