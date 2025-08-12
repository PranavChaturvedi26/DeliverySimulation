const request = require('supertest');
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require('../app.js');
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
    await Order.deleteMany({});
});

// Mock authentication middleware
jest.mock('../middleware/authMiddleware', () => ({
    protect: (req, res, next) => {
        req.user = { id: 'mockUserId', name: 'Test User' };
        next();
    }
}));

describe('Order Controller', () => {
    it('should create an order', async () => {
        const res = await request(app)
            .post('/api/orders')
            .send({
                order_id: 1,
                value_rs: 1500,
                route_id: 1,
                delivery_time: new Date().toISOString()
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.order_id).toBe(1);
    });

    it('should get all orders', async () => {
        // Create a test order first
        await Order.create({
            order_id: 2,
            value_rs: 2000,
            route_id: 2,
            delivery_time: new Date().toISOString()
        });

        const res = await request(app).get('/api/orders');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
    });
});
