import { ICacheService } from "../../../application/ports/cache/ICacheService";
import { createClient, RedisClientType } from "redis";
import { env } from "../../../config/envConfig";
export class CacheService implements ICacheService {
  private readonly _client: RedisClientType;
  private readonly _redisUrl: string;
  private _isConnecting: boolean;

  constructor() {
    this._redisUrl = env.redisUrl;
    this._client = createClient({ url: this._redisUrl });
    this.registerListners();
    this._isConnecting = false;
  }

  async registerListners() {
    this._client.on("connect", () => console.log("Redis Client Connected"));

    this._client.on("error", (error) => console.log("Redis Client Error", error));

    this._client.on("ready", () => console.log("Redis Client is Ready"));

    this._client.on("end", () => console.log("Redis client connection ended"));
  }

  async connectRedis() {
    if (this._client.isOpen || this._isConnecting) return;

    this._isConnecting = true;
    try {
      await this._client.connect();
    } catch (error) {
      console.log("Something went wrong Connecting to Client",error);
    } finally {
      this._isConnecting = false;
    }
  }

  async setData(key: string, ttl: number, value: string): Promise<void> {
    if (!this._client.isOpen) {
      await this.connectRedis();
    }

    await this._client.setEx(key, ttl, value);
  }

  async getData(key: string): Promise<string | null> {
    if (!this._client.isOpen) {
      await this.connectRedis();
    }

    return await this._client.get(key);
  }

  async deleteData(key: string): Promise<void> {
    if(!this._client.isOpen) {
      await this.connectRedis()
    }
    await this._client.del(key);
  }
}
