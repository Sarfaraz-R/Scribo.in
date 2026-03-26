import { Redis } from 'ioredis';

export const redisConfig = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null, // REQUIRED for BullMQ
};

// General-purpose client for GET/SET in controllers
export const redisConnection = new Redis(redisConfig);

redisConnection.on('error', (err) => console.error('Redis Connection Error:', err));