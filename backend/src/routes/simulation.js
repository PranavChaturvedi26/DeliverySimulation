const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { runSimulation, getLatestSimulation, getAllSimulations, getCacheStats, clearCache } = require("../controllers/simulationController");

router.post("/", protect, runSimulation);
router.get("/", protect, getAllSimulations);
router.get("/latest", protect, getLatestSimulation);
router.get("/cache/stats", protect, getCacheStats);
router.post("/cache/clear", protect, clearCache);

// Add route to create sample data for testing
router.post("/sample", protect, async (req, res) => {
    try {
        const Simulation = require("../models/Simulation");

        // Create multiple sample simulations for better visualization
        const sampleSimulations = [
            {
                numDrivers: 5,
                startTime: "09:00",
                maxHoursPerDriver: 8,
                totalProfit: 12500,
                efficiencyScore: 85, // 85% efficiency (not 0.85)
                onTimeDeliveries: 17,
                lateDeliveries: 3,
                fuelCost: 1250,
                createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            },
            {
                numDrivers: 6,
                startTime: "08:30",
                maxHoursPerDriver: 7,
                totalProfit: 14200,
                efficiencyScore: 92, // 92% efficiency (not 0.92)
                onTimeDeliveries: 23,
                lateDeliveries: 2,
                fuelCost: 980,
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            },
            {
                numDrivers: 4,
                startTime: "10:00",
                maxHoursPerDriver: 9,
                totalProfit: 9800,
                efficiencyScore: 78, // 78% efficiency (not 0.78)
                onTimeDeliveries: 14,
                lateDeliveries: 4,
                fuelCost: 1560,
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            }
        ];

        await Simulation.insertMany(sampleSimulations);
        res.json({ message: "Sample simulations created successfully", count: sampleSimulations.length });
    } catch (error) {
        console.error("Error creating sample simulations:", error);
        res.status(500).json({ message: "Failed to create sample simulations" });
    }
});

module.exports = router;
