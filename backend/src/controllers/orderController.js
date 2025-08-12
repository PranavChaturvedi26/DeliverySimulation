const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find();
    res.json(orders);
});

const getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }
    res.json(order);
});

const createOrder = asyncHandler(async (req, res) => {
    const { order_id, value_rs, route_id, delivery_time } = req.body;
    if (!order_id || !value_rs || !route_id || !delivery_time) {
        res.status(400);
        throw new Error("Please provide all required order fields");
    }
    const order = new Order({ order_id, value_rs, route_id, delivery_time });
    await order.save();
    res.status(201).json(order);
});

const updateOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }
    const { order_id, value_rs, route_id, delivery_time } = req.body;
    if (order_id !== undefined) order.order_id = order_id;
    if (value_rs !== undefined) order.value_rs = value_rs;
    if (route_id !== undefined) order.route_id = route_id;
    if (delivery_time !== undefined) order.delivery_time = delivery_time;

    await order.save();
    res.json(order);
});

const deleteOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }
    await order.deleteOne();
    res.json({ message: "Order removed" });
});

module.exports = { getOrders, getOrder, createOrder, updateOrder, deleteOrder };
