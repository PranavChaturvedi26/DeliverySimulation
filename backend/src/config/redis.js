const { createClient } = require('redis');

class RedisClient {
    constructor() {
        this.client = null;
        this.isConnected = false;
    }

    async connect() {
        try {
            const redisHost = process.env.REDIS_HOST || 'localhost';
            const redisPort = process.env.REDIS_PORT || 6379;
            const redisUrl = `redis://${redisHost}:${redisPort}`;

            this.client = createClient({
                url: redisUrl,
                socket: {
                    connectTimeout: 5000,
                    lazyConnect: true,
                },
                retry_strategy: (options) => {
                    if (options.error && options.error.code === 'ECONNREFUSED') {
                        console.log('Redis server connection refused.');
                    }
                    if (options.total_retry_time > 1000 * 60 * 60) {
                        return new Error('Retry time exhausted');
                    }
                    if (options.attempt > 10) {
                        return undefined;
                    }
                    return Math.min(options.attempt * 100, 3000);
                }
            });

            this.client.on('error', (err) => {
                console.error('Redis Client Error:', err);
                this.isConnected = false;
            });

            this.client.on('connect', () => {
                console.log('Redis Client Connected');
                this.isConnected = true;
            });

            this.client.on('ready', () => {
                console.log('Redis Client Ready');
                this.isConnected = true;
            });

            this.client.on('end', () => {
                console.log('Redis Client Disconnected');
                this.isConnected = false;
            });

            await this.client.connect();
            console.log('Redis connection established successfully');
            
        } catch (error) {
            console.error('Failed to connect to Redis:', error.message);
            this.isConnected = false;
        }
    }

    async disconnect() {
        if (this.client) {
            try {
                await this.client.quit();
                console.log('Redis client disconnected gracefully');
            } catch (error) {
                console.error('Error disconnecting Redis client:', error);
            }
        }
    }

    async get(key) {
        if (!this.isConnected || !this.client) {
            console.warn('Redis not connected, skipping get operation');
            return null;
        }

        try {
            const value = await this.client.get(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Redis GET error:', error);
            return null;
        }
    }

    async set(key, value, ttlSeconds = null) {
        if (!this.isConnected || !this.client) {
            console.warn('Redis not connected, skipping set operation');
            return false;
        }

        try {
            const serializedValue = JSON.stringify(value);
            
            if (ttlSeconds) {
                await this.client.setEx(key, ttlSeconds, serializedValue);
            } else {
                await this.client.set(key, serializedValue);
            }
            
            return true;
        } catch (error) {
            console.error('Redis SET error:', error);
            return false;
        }
    }

    async del(key) {
        if (!this.isConnected || !this.client) {
            console.warn('Redis not connected, skipping delete operation');
            return false;
        }

        try {
            await this.client.del(key);
            return true;
        } catch (error) {
            console.error('Redis DELETE error:', error);
            return false;
        }
    }

    async exists(key) {
        if (!this.isConnected || !this.client) {
            return false;
        }

        try {
            const result = await this.client.exists(key);
            return result === 1;
        } catch (error) {
            console.error('Redis EXISTS error:', error);
            return false;
        }
    }

    async flushAll() {
        if (!this.isConnected || !this.client) {
            console.warn('Redis not connected, skipping flush operation');
            return false;
        }

        try {
            await this.client.flushAll();
            return true;
        } catch (error) {
            console.error('Redis FLUSHALL error:', error);
            return false;
        }
    }

    async keys(pattern = '*') {
        if (!this.isConnected || !this.client) {
            console.warn('Redis not connected, skipping keys operation');
            return [];
        }

        try {
            return await this.client.keys(pattern);
        } catch (error) {
            console.error('Redis KEYS error:', error);
            return [];
        }
    }

    isReady() {
        return this.isConnected && this.client && this.client.isReady;
    }
}

const redisClient = new RedisClient();

module.exports = redisClient;