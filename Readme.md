
# @chinmay20409/nestjs-redis-helper

A lightweight, plug-and-play Redis helper module for NestJS. This package provides an injectable `RedisService` that wraps common Redis operations (`get`, `set`, `delete`, `delByPrefix`) and allows optional automatic deletion of keys by prefix on application bootstrap.

## ✨ Features

- ✅ Redis connection setup with `ioredis`
- ✅ Injectable `RedisService` for use across NestJS modules
- ✅ Auto-clear Redis keys with specific prefixes on app start
- ✅ Fully configurable via `forRoot()` options
- ✅ Global module — available app-wide

---

## 📦 Installation

```bash
npm install @chinmay20409/nestjs-redis-helper ioredis reflect-metadata
````

> Also ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

---

## 🚀 Usage

### 1. **Import the Module**

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@chinmay20409/nestjs-redis-helper';

@Module({
  imports: [
    RedisModule.forRoot({
      host: 'localhost',
      port: 6379,
      db: 0,
      ttl: 3600, // default TTL in seconds
      clearPrefixes: ['order:', 'session:'], // (optional) delete keys starting with these prefixes on app start
    }),
  ],
})
export class AppModule {}
```

---

### 2. **Inject and Use the RedisService**

```ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '@chinmay20409/nestjs-redis-helper';

@Injectable()
export class ExampleService {
  constructor(private readonly redisService: RedisService) {}

  async cacheSomething() {
    await this.redisService.setValue('user:1', { name: 'John' });
    const user = await this.redisService.getValue('user:1');
    console.log(user);
  }
}
```

---

## 🔧 API

### `setValue(key: string, value: any, ttl?: number): Promise<string>`

Sets a key with optional TTL (defaults to configured TTL).

---

### `getValue<T>(key: string): Promise<T | null>`

Gets and parses a key from Redis.

---

### `delValue(key: string): Promise<number>`

Deletes a single key.

---

### `delKeysByPrefix(prefix: string): Promise<void>`

Deletes all keys matching a prefix (e.g., `order:` will delete all keys starting with `order:`).

---

## 🧪 Example Auto Cleanup

On application start, the following runs automatically if `clearPrefixes` is configured:

```ts
async onApplicationBootstrap() {
  for (const prefix of this.clearPrefixes) {
    await this.delKeysByPrefix(prefix);
    console.log(`[RedisService] Cleared keys with prefix: ${prefix}`);
  }
}
```

---

## 🔐 Environment Configuration (Optional)

Instead of hardcoding options, you may fetch them from environment variables in your app before passing to `RedisModule.forRoot()`.

---

## 🛠 Built With

* [NestJS](https://nestjs.com/)
* [ioredis](https://github.com/luin/ioredis)
* TypeScript

---

## 📝 License

MIT © Chinmay20409

```

---

Let me know if you want me to publish this to GitHub for easier NPM link sharing.
```
