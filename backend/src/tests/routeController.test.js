const request = require('supertest');
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require('../app.js');
const Route = require('../models/Route.js');

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
    await Route.deleteMany({});
});

// Mock authentication middleware
jest.mock('../middleware/authMiddleware', () => ({
    protect: (req, res, next) => {
        req.user = { id: 'mockUserId', name: 'Test User' };
        next();
    }
}));

describe('Route Controller', () => {
    it('should create a route', async () => {
        const res = await request(app)
            .post('/api/routes')
            .send({
                route_id: 1,
                distance_km: 25.5,
                traffic_level: 'Medium',
                base_time_min: 45
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.route_id).toBe(1);
    });

    it('should get all routes', async () => {
        // Create a test route first
        await Route.create({
            route_id: 2,
            distance_km: 30.0,
            traffic_level: 'High',
            base_time_min: 60
        });

        const res = await request(app).get('/api/routes');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
    });
});
