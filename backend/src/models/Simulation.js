const mongoose = require("mongoose");

const simulationSchema = new mongoose.Schema({
    numDrivers: { type: Number, required: true },
    startTime: { type: String, required: true }, // "HH:MM"
    maxHoursPerDriver: { type: Number, required: true },
    totalProfit: Number,
    efficiencyScore: Number,
    onTimeDeliveries: Number,
    lateDeliveries: Number,
    fuelCost: Number,
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Simulation", simulationSchema);
