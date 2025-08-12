const app = require("./app");
const connectDB = require("./config/db");
const { seedData, initializeRedis } = require("./app");

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'default-jwt-secret-for-development-only';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = JWT_SECRET;
    console.log("Using default JWT_SECRET - change this in production!");
}

if (!process.env.FRONTEND_URL) {
    process.env.FRONTEND_URL = FRONTEND_URL;
}

(async () => {
    try {
        console.log(`Starting server in ${NODE_ENV} mode...`);
        console.log(`Frontend URL: ${FRONTEND_URL}`);

        try {
            await connectDB();
            await seedData();
        } catch (dbError) {
            console.log("MongoDB connection failed, but server will continue...");
        }

        await initializeRedis();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`API endpoints available at: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
})();
