import { Redis } from "ioredis";

export const queueConnection = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: 6379,
  maxRetriesPerRequest: null, // importante pro BullMQ
});
