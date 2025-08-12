const asyncHandler = require("express-async-handler");
const Simulation = require("../models/Simulation");
const Driver = require("../models/Driver");
const Route = require("../models/Route");
const Order = require("../models/Order");



const runSimulation = asyncHandler(async (req, res) => {
    const { numDrivers, startTime, maxHoursPerDriver } = req.body;

    if (
        typeof numDrivers !== "number" ||
        typeof maxHoursPerDriver !== "number" ||
        !startTime ||
        numDrivers <= 0 ||
        maxHoursPerDriver <= 0
    ) {
        res.status(400);
        throw new Error("Invalid simulation inputs");
    }

    const drivers = await Driver.find().limit(numDrivers);
    const routes = await Route.find();
    const orders = await Order.find();

    if (drivers.length < numDrivers) {
        res.status(400);
        throw new Error("Not enough drivers available");
    }

    const routeMap = {};
    routes.forEach((r) => {
        routeMap[r.route_id] = r;
    });

    const BONUS_RATE = 0.1;
    const BASE_FUEL_RATE = 5;
    const TRAFFIC_FUEL_EXTRA = 2;
    const LATE_PENALTY = 50;
    const EXTRA_DELAY_MIN = 10;

    let totalProfit = 0;
    let onTimeDeliveries = 0;
    let lateDeliveries = 0;
    let fuelCostTotal = 0;

    const driverWorkMinutes = new Array(drivers.length).fill(0);
    const driverFatigueFactor = drivers.map((d) => {
        const last = Array.isArray(d.past_week_hours) && d.past_week_hours.length > 0
            ? d.past_week_hours[d.past_week_hours.length - 1]
            : 0;
        return last > 8 ? 1.3 : 1;
    });

    const primaryOrders = [];
    const extraOrders = [];

    let driverIndex = 0;
    for (const order of orders) {
        const assignedDriver = drivers[driverIndex];
        const fatigueFactor = driverFatigueFactor[driverIndex];
        const route = routeMap[order.route_id];
        if (!route) {
            driverIndex = (driverIndex + 1) % drivers.length;
            continue;
        }

        const estMinutes = (route.base_time_min * fatigueFactor) + EXTRA_DELAY_MIN;
        const projectedHours = (driverWorkMinutes[driverIndex] + estMinutes) / 60;

        if (projectedHours <= maxHoursPerDriver) {
            primaryOrders.push({ order, driverIndex });
        } else {
            extraOrders.push({ order, driverIndex });
        }

        driverIndex = (driverIndex + 1) % drivers.length;
    }

    const allAssignments = [...primaryOrders, ...extraOrders];

    for (const { order, driverIndex } of allAssignments) {
        const route = routeMap[order.route_id];
        if (!route) continue;

        const fatigueFactor = driverFatigueFactor[driverIndex];
        const deliveryTime = route.base_time_min * fatigueFactor;
        const actualDeliveryTime = deliveryTime + EXTRA_DELAY_MIN;
        const isLate = actualDeliveryTime > route.base_time_min + EXTRA_DELAY_MIN;

        if (isLate) lateDeliveries++;
        else onTimeDeliveries++;

        const bonus = order.value_rs > 1000 && !isLate ? order.value_rs * BONUS_RATE : 0;

        let fuelCost = route.distance_km * BASE_FUEL_RATE;
        if (route.traffic_level === "High") fuelCost += route.distance_km * TRAFFIC_FUEL_EXTRA;
        fuelCostTotal += fuelCost;

        const profit = order.value_rs + bonus - (isLate ? LATE_PENALTY : 0) - fuelCost;
        totalProfit += profit;

        driverWorkMinutes[driverIndex] += actualDeliveryTime;
    }

    for (let idx = 0; idx < drivers.length; idx++) {
        const driver = drivers[idx];
        if (!Array.isArray(driver.past_week_hours)) driver.past_week_hours = [];
        const hoursToday = driverWorkMinutes[idx] / 60;
        if (driver.past_week_hours.length >= 7) driver.past_week_hours.shift();
        driver.past_week_hours.push(hoursToday);
        await driver.save();
    }

    const totalDeliveries = onTimeDeliveries + lateDeliveries;
    const efficiencyScore = totalDeliveries === 0 ? 0 : Math.round((onTimeDeliveries / totalDeliveries) * 100);

    const simulation = await Simulation.create({
        numDrivers,
        startTime,
        maxHoursPerDriver,
        totalProfit,
        efficiencyScore,
        onTimeDeliveries,
        lateDeliveries,
        fuelCost: fuelCostTotal,
    });

    res.status(201).json(simulation);
});

const getLatestSimulation = asyncHandler(async (req, res) => {
    const latestSim = await Simulation.findOne().sort({ createdAt: -1 });

    // If no simulations exist, return null - don't create sample data
    if (!latestSim) {
        return res.json(null);
    }

    res.json(latestSim);
});

const getAllSimulations = async (req, res) => {
    try {
        const simulations = await Simulation.find({})
            .sort({ createdAt: -1 }); // newest first

        // Don't create sample data here - only getLatestSimulation should do that
        res.json(simulations);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch simulations" });
    }
};

module.exports = { runSimulation, getLatestSimulation, getAllSimulations };
