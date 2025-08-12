const asyncHandler = require("express-async-handler");
const Route = require("../models/Route");

const getRoutes = asyncHandler(async (req, res) => {
    const routes = await Route.find();
    res.json(routes);
});

const getRoute = asyncHandler(async (req, res) => {
    const route = await Route.findById(req.params.id);
    if (!route) {
        res.status(404);
        throw new Error("Route not found");
    }
    res.json(route);
});

const createRoute = asyncHandler(async (req, res) => {
    const { route_id, distance_km, traffic_level, base_time_min } = req.body;
    if (!route_id || !distance_km || !traffic_level || !base_time_min) {
        res.status(400);
        throw new Error("Please provide all required route fields");
    }
    const route = new Route({ route_id, distance_km, traffic_level, base_time_min });
    await route.save();
    res.status(201).json(route);
});

const updateRoute = asyncHandler(async (req, res) => {
    const route = await Route.findById(req.params.id);
    if (!route) {
        res.status(404);
        throw new Error("Route not found");
    }
    const { route_id, distance_km, traffic_level, base_time_min } = req.body;
    if (route_id !== undefined) route.route_id = route_id;
    if (distance_km !== undefined) route.distance_km = distance_km;
    if (traffic_level !== undefined) route.traffic_level = traffic_level;
    if (base_time_min !== undefined) route.base_time_min = base_time_min;

    await route.save();
    res.json(route);
});

const deleteRoute = asyncHandler(async (req, res) => {
    const route = await Route.findById(req.params.id);
    if (!route) {
        res.status(404);
        throw new Error("Route not found");
    }
    await route.deleteOne();
    res.json({ message: "Route removed" });
});

module.exports = { getRoutes, getRoute, createRoute, updateRoute, deleteRoute };
