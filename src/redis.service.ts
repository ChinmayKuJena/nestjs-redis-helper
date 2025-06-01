import { Inject, Injectable, OnApplicationBootstrap, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService implements OnApplicationBootstrap, OnModuleDestroy {
    constructor(
        @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
        @Inject('REDIS_TTL') private readonly ttl: number,
        @Inject('REDIS_CLEAR_PREFIXES') private readonly clearPrefixes: string[],
    ) {
        this.clearPrefixes = clearPrefixes ?? []; // ✅ fallback
    }

    async onApplicationBootstrap() {
        for (const prefix of this.clearPrefixes) {
            await this.delKeysByPrefix(prefix);
            console.log(`[RedisService] Cleared keys with prefix: ${prefix}`);
        }
    }

    async setValue(key: string, value: any, ttl: number = this.ttl): Promise<string> {
        return this.redisClient.set(key, JSON.stringify(value), 'EX', ttl);
    }

    async getValue<T = any>(key: string): Promise<T | null> {
        const value = await this.redisClient.get(key);
        return value ? JSON.parse(value) : null;
    }

    async delValue(key: string): Promise<number> {
        return this.redisClient.del(key);
    }

    async delKeysByPrefix(prefix: string): Promise<void> {
        const stream = this.redisClient.scanStream({
            match: `${prefix}*`,
            count: 100,
        });

        stream.on('data', (keys: string[]) => {
            if (keys.length) this.redisClient.del(...keys);
        });

        return new Promise((resolve, reject) => {
            stream.on('end', resolve);
            stream.on('error', reject);
        });
    }

    async onModuleDestroy() {
        await this.redisClient.quit();
    }
}
