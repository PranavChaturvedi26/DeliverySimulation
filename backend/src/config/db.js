const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/purplemerit';
        console.log("Connecting to MongoDB...");

        await mongoose.connect(mongoURI);
        console.log("MongoDB connected successfully!");

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Available collections:", collections.map(c => c.name));

    } catch (err) {
        console.error("MongoDB connection failed:", err.message);
        throw err;
    }
};

module.exports = connectDB;
