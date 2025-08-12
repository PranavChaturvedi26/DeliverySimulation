const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    order_id: Number,
    value_rs: Number,
    route_id: Number,
    delivery_time: String
});

module.exports = mongoose.model("Order", orderSchema);
