import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

const inMemoryRedis = new Map<string, string>();

class RedisService {
  private client;
  public isConnected = false;

  constructor() {
    this.client = createClient({ url: redisUrl });
    this.client.on('error', (err) => {
      this.isConnected = false;
    });
    this.client.connect()
      .then(() => {
        this.isConnected = true;
        console.log('[Redis] Connected to Redis server');
      })
      .catch(() => {
        this.isConnected = false;
        console.warn('[Redis] Redis server unavailable. Falling back to in-memory KV cache.');
      });
  }

  async get(key: string): Promise<string | null> {
    if (this.isConnected) {
      try {
        return await this.client.get(key);
      } catch {
        return inMemoryRedis.get(key) || null;
      }
    }
    return inMemoryRedis.get(key) || null;
  }

  async set(key: string, value: string, EX?: number): Promise<void> {
    if (this.isConnected) {
      try {
        if (EX) {
          await this.client.set(key, value, { EX });
        } else {
          await this.client.set(key, value);
        }
        return;
      } catch {
        // fallback
      }
    }
    inMemoryRedis.set(key, value);
  }

  async del(key: string): Promise<void> {
    if (this.isConnected) {
      try {
        await this.client.del(key);
        return;
      } catch {
        // fallback
      }
    }
    inMemoryRedis.delete(key);
  }
}

export const redis = new RedisService();
