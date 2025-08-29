import { createClient,RedisClientType } from "redis";
import { IkeyValueTTLCaching } from "../../../application/services/Cache/IkeyValueTTLCaching";

export class KeyValueTTLCachingImpl implements IkeyValueTTLCaching{
    private _redisClient:RedisClientType;
    constructor(){
        this._redisClient = createClient({
            url:process.env.REDIS_URL || 'redis://localhost:6379'
        })

        this._redisClient.on("error",(err) => console.log("Error occured on redis database",err));
        this._redisClient.on("connect",()=>console.log("Redis connected successfully"));
        this._redisClient.on("disconnect",() => console.log("Redis disconnected"));
    }

    async connect(){
        if(!this._redisClient.isOpen) {
            await this._redisClient.connect();
        }
    }

    async setData(key: string, time: number, value: string): Promise<void> {
        if(!this._redisClient.isOpen){
            await this.connect()
        }
        this._redisClient.setEx(key,time,value);
    }

    async getData(key: string): Promise<string | null> {
        if(!this._redisClient.isOpen){
            await this.connect()
        }
        return await this._redisClient.get(key);
    }

    async deleteData(key: string): Promise<void> {
        if(!this._redisClient.isOpen){
            await this.connect()
        }
        await this._redisClient.del(key)
    }
}