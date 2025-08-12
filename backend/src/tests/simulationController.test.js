const request = require('supertest');
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require('../app.js');
const Simulation = require('../models/Simulation.js');
const Driver = require('../models/Driver.js');
const Route = require('../models/Route.js');
const Order = require('../models/Order.js');

let mongoServer;

beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await Simulation.deleteMany({});
    await Driver.deleteMany({});
    await Route.deleteMany({});
    await Order.deleteMany({});
});

// Mock authentication middleware
jest.mock('../middleware/authMiddleware', () => ({
    protect: (req, res, next) => {
        req.user = { id: 'mockUserId', name: 'Test User' };
        next();
    }
}));

describe('Simulation Controller', () => {
    beforeEach(async () => {
        // Create test data for simulation
        await Driver.create({
            name: 'Test Driver 1',
            shift_hours: 8,
            past_week_hours: [40, 38, 42, 35, 39, 41, 37]
        });
        await Driver.create({
            name: 'Test Driver 2',
            shift_hours: 6,
            past_week_hours: [35, 36, 38, 32, 34, 37, 33]
        });

        await Route.create({
            route_id: 1,
            distance_km: 25.5,
            traffic_level: 'Medium',
            base_time_min: 45
        });

        await Order.create({
            order_id: 1,
            value_rs: 1500,
            route_id: 1,
            delivery_time: new Date().toISOString()
        });
    });

    it('should get all simulations', async () => {
        // Create a test simulation first
        await Simulation.create({
            numDrivers: 5,
            startTime: '2024-01-15T09:00:00',
            maxHoursPerDriver: 8,
            totalProfit: 10000,
            efficiencyScore: 85,
            onTimeDeliveries: 17,
            lateDeliveries: 3,
            fuelCost: 1250
        });

        const res = await request(app).get('/api/simulation');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
    });

    it('should create a simulation', async () => {
        const res = await request(app)
            .post('/api/simulation')
            .send({
                numDrivers: 2,
                startTime: '2024-01-15T10:00:00',
                maxHoursPerDriver: 6
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.numDrivers).toBe(2);
    });
});
