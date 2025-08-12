const redisClient = require('../config/redis');
const crypto = require('crypto');

class CacheService {
    constructor() {
        this.defaultTTL = parseInt(process.env.CACHE_TTL) || 300; // 5 minutes default
        this.simulationTTL = 1800; // 30 minutes for simulation results
        this.listTTL = 600; // 10 minutes for list operations
    }

    generateCacheKey(prefix, params) {
        if (typeof params === 'object') {
            const sortedParams = Object.keys(params)
                .sort()
                .reduce((result, key) => {
                    result[key] = params[key];
                    return result;
                }, {});
            
            const paramsStr = JSON.stringify(sortedParams);
            const hash = crypto.createHash('md5').update(paramsStr).digest('hex');
            return `${prefix}:${hash}`;
        }
        return `${prefix}:${params}`;
    }

    async getCachedSimulation(params) {
        try {
            const cacheKey = this.generateCacheKey('simulation', params);
            console.log(`Checking cache for simulation with key: ${cacheKey}`);
            
            const cachedResult = await redisClient.get(cacheKey);
            if (cachedResult) {
                console.log('Cache hit: Found cached simulation result');
                return {
                    data: cachedResult,
                    fromCache: true,
                    cacheKey
                };
            }
            
            console.log('Cache miss: No cached simulation result found');
            return null;
        } catch (error) {
            console.error('Error getting cached simulation:', error);
            return null;
        }
    }

    async setCachedSimulation(params, result) {
        try {
            const cacheKey = this.generateCacheKey('simulation', params);
            console.log(`Caching simulation result with key: ${cacheKey}`);
            
            const success = await redisClient.set(cacheKey, result, this.simulationTTL);
            if (success) {
                console.log(`Simulation result cached successfully for ${this.simulationTTL} seconds`);
            }
            
            return { success, cacheKey };
        } catch (error) {
            console.error('Error caching simulation result:', error);
            return { success: false, error: error.message };
        }
    }

    async getCachedList(type, query = {}) {
        try {
            const cacheKey = this.generateCacheKey(`list:${type}`, query);
            console.log(`Checking cache for ${type} list with key: ${cacheKey}`);
            
            const cachedResult = await redisClient.get(cacheKey);
            if (cachedResult) {
                console.log(`Cache hit: Found cached ${type} list`);
                return {
                    data: cachedResult,
                    fromCache: true,
                    cacheKey
                };
            }
            
            console.log(`Cache miss: No cached ${type} list found`);
            return null;
        } catch (error) {
            console.error(`Error getting cached ${type} list:`, error);
            return null;
        }
    }

    async setCachedList(type, query, result) {
        try {
            const cacheKey = this.generateCacheKey(`list:${type}`, query);
            console.log(`Caching ${type} list with key: ${cacheKey}`);
            
            const success = await redisClient.set(cacheKey, result, this.listTTL);
            if (success) {
                console.log(`${type} list cached successfully for ${this.listTTL} seconds`);
            }
            
            return { success, cacheKey };
        } catch (error) {
            console.error(`Error caching ${type} list:`, error);
            return { success: false, error: error.message };
        }
    }

    async invalidateSimulationCache() {
        try {
            console.log('Invalidating simulation cache...');
            const keys = await redisClient.keys('simulation:*');
            
            if (keys.length > 0) {
                for (const key of keys) {
                    await redisClient.del(key);
                }
                console.log(`Invalidated ${keys.length} simulation cache entries`);
            } else {
                console.log('No simulation cache entries to invalidate');
            }
            
            return true;
        } catch (error) {
            console.error('Error invalidating simulation cache:', error);
            return false;
        }
    }

    async invalidateListCache(type) {
        try {
            console.log(`Invalidating ${type} list cache...`);
            const keys = await redisClient.keys(`list:${type}:*`);
            
            if (keys.length > 0) {
                for (const key of keys) {
                    await redisClient.del(key);
                }
                console.log(`Invalidated ${keys.length} ${type} list cache entries`);
            } else {
                console.log(`No ${type} list cache entries to invalidate`);
            }
            
            return true;
        } catch (error) {
            console.error(`Error invalidating ${type} list cache:`, error);
            return false;
        }
    }

    async getCacheStats() {
        try {
            if (!redisClient.isReady()) {
                return { error: 'Redis not connected' };
            }

            const simulationKeys = await redisClient.keys('simulation:*');
            const listKeys = await redisClient.keys('list:*');
            
            return {
                connected: true,
                simulationCacheEntries: simulationKeys.length,
                listCacheEntries: listKeys.length,
                totalCacheEntries: simulationKeys.length + listKeys.length,
                simulationTTL: this.simulationTTL,
                listTTL: this.listTTL
            };
        } catch (error) {
            console.error('Error getting cache stats:', error);
            return { error: error.message };
        }
    }

    async clearAllCache() {
        try {
            console.log('Clearing all cache...');
            const success = await redisClient.flushAll();
            
            if (success) {
                console.log('All cache cleared successfully');
            }
            
            return success;
        } catch (error) {
            console.error('Error clearing all cache:', error);
            return false;
        }
    }
}

module.exports = new CacheService();