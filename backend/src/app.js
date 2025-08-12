const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const loadCSV = require("./utils/csvLoader");
const Driver = require("./models/Driver");
const Route = require("./models/Route");
const Order = require("./models/Order");
const cookieParser = require('cookie-parser');
const redisClient = require('./config/redis');

dotenv.config();

const app = express();


app.use(cookieParser());
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? [
            'https://purple-merit-assessment-bay.vercel.app',
            'https://purple-merit-assessment-oey9hdjkb-biswayanpauls-projects.vercel.app',
            'https://purple-merit-assessment-bbknsd3th-biswayanpauls-projects.vercel.app',
            /^https:\/\/purple-merit-assessment.*\.vercel\.app$/,
            /^https:\/\/.*purple.*merit.*assessment.*\.vercel\.app$/
        ]
        : ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));
app.use(express.json());

const initializeRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Redis initialized successfully');
    } catch (error) {
        console.error('Redis initialization failed:', error.message);
        console.log('Application will continue without Redis caching');
    }
};

const seedData = async () => {
    try {
        if ((await Driver.countDocuments()) === 0) {
            const drivers = await loadCSV(path.join(__dirname, "../data/drivers.csv"));
            await Driver.insertMany(
                drivers.map((d) => ({
                    name: d.name,
                    shift_hours: Number(d.shift_hours),
                    past_week_hours: d.past_week_hours.split("|").map(Number),
                }))
            );
        }
        if ((await Route.countDocuments()) === 0) {
            const routes = await loadCSV(path.join(__dirname, "../data/routes.csv"));
            await Route.insertMany(
                routes.map((r) => ({
                    route_id: Number(r.route_id),
                    distance_km: Number(r.distance_km),
                    traffic_level: r.traffic_level,
                    base_time_min: Number(r.base_time_min),
                }))
            );
        }
        if ((await Order.countDocuments()) === 0) {
            const orders = await loadCSV(path.join(__dirname, "../data/orders.csv"));
            await Order.insertMany(
                orders.map((o) => ({
                    order_id: Number(o.order_id),
                    value_rs: Number(o.value_rs),
                    route_id: Number(o.route_id),
                    delivery_time: o.delivery_time,
                }))
            );
        }
    } catch (error) {
        console.error("Seeding error:", error);
    }
};

// Mount routes here
app.use("/api/auth", require("./routes/auth"));
app.use("/api/drivers", require("./routes/drivers"));
app.use("/api/orders", require("./routes/orders"));
app.use("/api/routes", require("./routes/routes"));
app.use("/api/simulation", require("./routes/simulation"));


app.get("/", (req, res) => res.send("API running..."));

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message });
});

module.exports = app;
module.exports.seedData = seedData;
module.exports.initializeRedis = initializeRedis;
