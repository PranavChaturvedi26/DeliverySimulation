const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getDrivers,
    getDriverById,
    createDriver,
    updateDriver,
    deleteDriver,
} = require("../controllers/driverController");

router.route("/")
    .get(protect, getDrivers)
    .post(protect, createDriver);

router.route("/:id")
    .get(protect, getDriverById)  // Optional but recommended
    .put(protect, updateDriver)
    .delete(protect, deleteDriver);

module.exports = router;
