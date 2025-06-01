import { DynamicModule, Global, Module } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

export interface RedisModuleOptions {
    host: string;
    port: number;
    password?: string;
    db?: number;
    ttl?: number;
    clearPrefixesOnStartup?: string[]; // ✅ Added option
}

@Global()
@Module({})
export class RedisModule {
    static forRoot(options: RedisModuleOptions): DynamicModule {
        const redisClientProvider = {
            provide: 'REDIS_CLIENT',
            useFactory: () => {
                return new Redis({
                    host: options.host,
                    port: options.port,
                    password: options.password,
                    db: options.db || 0,
                });
            },
        };

        const ttlProvider = {
            provide: 'REDIS_TTL',
            useValue: options.ttl || 3600,
        };

        const startupPrefixesProvider = {
            provide: 'REDIS_CLEAR_PREFIXES',
            useValue: options.clearPrefixesOnStartup || [],
        };

        return {
            module: RedisModule,
            providers: [
                redisClientProvider,
                ttlProvider,
                startupPrefixesProvider,
                RedisService,
            ],
            exports: [
                'REDIS_CLIENT',
                'REDIS_TTL',
                'REDIS_CLEAR_PREFIXES',
                RedisService,
            ],
        };
    }
}
