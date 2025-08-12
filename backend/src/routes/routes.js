const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getRoutes, getRoute, createRoute, updateRoute, deleteRoute } = require("../controllers/routeController");

router.route("/")
    .get(protect, getRoutes)
    .post(protect, createRoute);

router.route("/:id")
    .get(protect, getRoute)
    .put(protect, updateRoute)
    .delete(protect, deleteRoute);

module.exports = router;
