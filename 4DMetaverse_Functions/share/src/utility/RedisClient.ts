import { logger } from 'firebase-functions';
import { createClient, RedisClientType } from 'redis';

// async redis wrapper
class RedisClient {
    private client?: RedisClientType;
    private database: number;

    constructor(database: number = 0) {
        this.database = database;
    }

    private async checkConnect(): Promise<void> {
        if (this.client === undefined) {
            this.client = createClient({
                url: process.env.REDIS_DSN,
                database: this.database
            });
            this.client.on('error', (err) => {
                logger.info(`Redis ${this.database} error: `, err);
                this.client = undefined;
            });
            await this.client!.connect()
        }
    }

    public async flushdb(): Promise<any> {
        await this.checkConnect();
        await this.client!.flushAll();
    }

    public async keys(key: string = '*'): Promise<string[]> {
        await this.checkConnect();
        return await this.client!.keys(key);
    }

    public async get(key: string): Promise<string | null> {
        await this.checkConnect();
        return await this.client!.get(key);
    }

    public async set(key: string, val: string): Promise<any> {
        await this.checkConnect();
        return await this.client!.set(key, val);
    }

    public async exist(key: string): Promise<boolean> {
        await this.checkConnect();
        const res = await this.client!.exists(key);
        return res === 1;
    }

    public async expire(key: string, time: number): Promise<void> {
        await this.checkConnect();
        await this.client!.expire(key, time);
    }

    public async ttl(key: string): Promise<number> {
        await this.checkConnect();
        return await this.client!.ttl(key);
    }

    public async del(key: string | string[]): Promise<void> {
        await this.checkConnect();
        await this.client!.del(key);
    }

    public async increase(key: string): Promise<void> {
        await this.checkConnect();
        await this.client!.incr(key);
    }
}

export default RedisClient;