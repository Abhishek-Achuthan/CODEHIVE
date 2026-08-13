import { ICacheService } from '../../../application/ports/cache/ICacheService';
import { createClient, RedisClientType } from 'redis';
import { env } from '../../../config/envConfig';

export class CacheService implements ICacheService {
  private _client: RedisClientType | null = null;
  private _isConnecting = false;

  private getClient(): RedisClientType {
    if (!this._client) {
      const redisUrl = env.redisUrl;
      console.log('Initializing Redis client, REDIS_URL present:', Boolean(redisUrl));
      this._client = createClient({ url: redisUrl });
      this.registerListeners(this._client);
    }
    return this._client;
  }

  private registerListeners(client: RedisClientType) {
    client.on('connect', () => console.log('Redis Client Connected'));
    client.on('error', (error) => console.log('Redis Client Error:', error.message));
    client.on('ready', () => console.log('Redis Client is Ready'));
    client.on('end', () => console.log('Redis client connection ended'));
  }

  async connectRedis() {
    const client = this.getClient();
    if (client.isOpen || this._isConnecting) return;

    this._isConnecting = true;
    try {
      await client.connect();
    } catch (error) {
      console.log('Something went wrong Connecting to Redis Client:', error instanceof Error ? error.message : error);
    } finally {
      this._isConnecting = false;
    }
  }

  async setData(key: string, ttl: number, value: string): Promise<void> {
    const client = this.getClient();
    if (!client.isOpen) {
      await this.connectRedis();
    }

    await client.setEx(key, ttl, value);
  }

  async getData(key: string): Promise<string | null> {
    const client = this.getClient();
    if (!client.isOpen) {
      await this.connectRedis();
    }

    return await client.get(key);
  }

  async deleteData(key: string): Promise<void> {
    const client = this.getClient();
    if (!client.isOpen) {
      await this.connectRedis();
    }

    await client.del(key);
  }
}

