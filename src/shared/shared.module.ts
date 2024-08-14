import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import * as redisStore from 'cache-manager-redis-store';
import * as redis from 'redis';

@Module({
  imports: [
    JwtModule.register({
      secret: 'secretKey',
      signOptions: { expiresIn: '1d' },
    }),
    CacheModule.register<redis.RedisClientOptions>({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  exports: [JwtModule, CacheModule],
})
export class SharedModule {}
