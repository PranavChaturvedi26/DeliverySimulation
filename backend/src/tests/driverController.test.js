const request = require('supertest');
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require('../app.js');
const Driver = require('../models/Driver.js');

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
    await Driver.deleteMany({});
});

// Mock authentication middleware
jest.mock('../middleware/authMiddleware', () => ({
    protect: (req, res, next) => {
        req.user = { id: 'mockUserId', name: 'Test User' };
        next();
    }
}));

describe('Driver Controller', () => {
    it('should create a driver', async () => {
        const res = await request(app)
            .post('/api/drivers')
            .send({
                name: 'John Doe',
                shift_hours: 6,
                past_week_hours: [40, 38, 42, 35, 39, 41, 37]
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_id');
        expect(res.body.name).toBe('John Doe');
    });

    it('should get all drivers', async () => {
        // Create a test driver first
        await Driver.create({
            name: 'Test Driver',
            shift_hours: 4,
            past_week_hours: [35, 36, 38, 32, 34, 37, 33]
        });

        const res = await request(app).get('/api/drivers');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
    });
});
