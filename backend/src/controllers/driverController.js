const asyncHandler = require("express-async-handler");
const Driver = require("../models/Driver");

const getDrivers = asyncHandler(async (req, res) => {
    const drivers = await Driver.find();
    res.json(drivers);
});

const createDriver = asyncHandler(async (req, res) => {
    const { name, shift_hours, past_week_hours } = req.body;
    if (!name || shift_hours == null || !Array.isArray(past_week_hours)) {
        res.status(400);
        throw new Error("Missing or invalid driver data");
    }
    const driver = new Driver({ name, shift_hours, past_week_hours });
    await driver.save();
    res.status(201).json(driver);
});

const updateDriver = asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
        res.status(404);
        throw new Error("Driver not found");
    }
    const { name, shift_hours, past_week_hours } = req.body;
    if (name !== undefined) driver.name = name;
    if (shift_hours !== undefined) driver.shift_hours = shift_hours;
    if (past_week_hours !== undefined) driver.past_week_hours = past_week_hours;
    await driver.save();
    res.json(driver);
});

const deleteDriver = asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
        res.status(404);
        throw new Error("Driver not found");
    }
    await driver.deleteOne();
    res.json({ message: "Driver removed" });
});
const getDriverById = asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
        res.status(404);
        throw new Error("Driver not found");
    }
    res.json(driver);
});

module.exports = { getDrivers, createDriver, updateDriver, deleteDriver, getDriverById };

