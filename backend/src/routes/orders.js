const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getOrders, getOrder, createOrder, updateOrder, deleteOrder } = require("../controllers/orderController");

router.route("/")
    .get(protect, getOrders)
    .post(protect, createOrder);

router.route("/:id")
    .get(protect, getOrder)
    .put(protect, updateOrder)
    .delete(protect, deleteOrder);

module.exports = router;
