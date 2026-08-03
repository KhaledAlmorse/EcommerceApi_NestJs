import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { createKeyv } from '@keyv/redis';
import { redisConfig } from './Config/redis.config';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      ...redisConfig,
    }),
  ],
  controllers: [],
  providers: [],
})
export class CoreModule {}
