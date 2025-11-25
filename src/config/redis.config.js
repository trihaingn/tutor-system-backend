/**
 * CONFIG: Redis Configuration
 * FILE: redis.config.js
 * MỤC ĐÍCH: Cấu hình Redis cho caching và session storage
 * 
 * ENVIRONMENT VARIABLES:
 * - REDIS_HOST: Redis server host
 * - REDIS_PORT: Redis port (default 6379)
 * - REDIS_PASSWORD: Redis password (optional)
 * - REDIS_DB: Redis database number (default 0)
 * 
 * USE CASES:
 * - Session storage (JWT blacklist)
 * - Rate limiting (shared state across servers)
 * - Caching (API responses, database queries)
 * 
 * NOTE: Feature này là OPTIONAL - có thể dùng in-memory thay thế
 */

// TODO: Import dotenv
// require('dotenv').config()

// ============================================================
// REDIS CONFIGURATION
// ============================================================
// PURPOSE: Export Redis connection settings
// 
// PSEUDOCODE:
// const redisConfig = {
//   // Connection Settings
//   host: process.env.REDIS_HOST || 'localhost',
//   port: parseInt(process.env.REDIS_PORT) || 6379,
//   password: process.env.REDIS_PASSWORD || undefined,
//   db: parseInt(process.env.REDIS_DB) || 0,
//   
//   // Connection Options
//   options: {
//     // Retry strategy
//     retryStrategy: (times) => {
//       const delay = Math.min(times * 50, 2000)
//       return delay
//     },
//     
//     // Connection timeout
//     connectTimeout: 10000,
//     
//     // Keep alive
//     keepAlive: true,
//     
//     // Enable offline queue
//     enableOfflineQueue: true
//   },
//   
//   // TTL Defaults (in seconds)
//   ttl: {
//     session: 60 * 60 * 24 * 7, // 7 days
//     cache: 60 * 60,             // 1 hour
//     rateLimit: 60 * 15          // 15 minutes
//   },
//   
//   // Feature Flag
//   enabled: process.env.ENABLE_REDIS === 'true' || false
// }

// ============================================================
// REDIS CLIENT SETUP (if using ioredis)
// ============================================================
// PURPOSE: Tạo Redis client instance
// 
// PSEUDOCODE:
// const Redis = require('ioredis')
// 
// let redisClient = null
// 
// const connectRedis = () => {
//   if (!redisConfig.enabled) {
//     console.log('[REDIS] Redis disabled, using in-memory fallback')
//     return null
//   }
//   
//   if (redisClient) {
//     return redisClient
//   }
//   
//   redisClient = new Redis({
//     host: redisConfig.host,
//     port: redisConfig.port,
//     password: redisConfig.password,
//     db: redisConfig.db,
//     ...redisConfig.options
//   })
//   
//   redisClient.on('connect', () => {
//     console.log('[REDIS] Connected successfully')
//   })
//   
//   redisClient.on('error', (err) => {
//     console.error('[REDIS] Connection error:', err)
//   })
//   
//   return redisClient
// }

// ============================================================
// REDIS UTILITY FUNCTIONS
// ============================================================
// PURPOSE: Helper functions cho common operations
// 
// PSEUDOCODE:
// const setCache = async (key, value, ttl = redisConfig.ttl.cache) => {
//   if (!redisClient) return
//   await redisClient.setex(key, ttl, JSON.stringify(value))
// }
// 
// const getCache = async (key) => {
//   if (!redisClient) return null
//   const data = await redisClient.get(key)
//   return data ? JSON.parse(data) : null
// }
// 
// const deleteCache = async (key) => {
//   if (!redisClient) return
//   await redisClient.del(key)
// }
// 
// const clearCachePattern = async (pattern) => {
//   if (!redisClient) return
//   const keys = await redisClient.keys(pattern)
//   if (keys.length > 0) {
//     await redisClient.del(...keys)
//   }
// }

// ============================================================
// USE CASES EXAMPLES
// ============================================================
// USE CASE 1: JWT Blacklist (logout)
// await setCache(`blacklist:${token}`, true, 60 * 60 * 24 * 7) // 7 days
// 
// USE CASE 2: Rate Limiting
// const key = `ratelimit:${userId}:${endpoint}`
// const count = await redisClient.incr(key)
// if (count === 1) {
//   await redisClient.expire(key, 60 * 15) // 15 minutes
// }
// if (count > 100) {
//   throw new Error('Rate limit exceeded')
// }
// 
// USE CASE 3: Caching API response
// const cacheKey = `tutors:search:${JSON.stringify(query)}`
// let result = await getCache(cacheKey)
// if (!result) {
//   result = await TutorService.searchTutors(query)
//   await setCache(cacheKey, result, 60 * 5) // 5 minutes
// }

// TODO: Export configuration and client
// module.exports = {
//   redisConfig,
//   connectRedis,
//   setCache,
//   getCache,
//   deleteCache,
//   clearCachePattern
// }
