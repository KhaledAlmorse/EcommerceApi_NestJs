import { createKeyv } from '@keyv/redis';
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';

export const redisConfig: CacheModuleAsyncOptions = {
  useFactory: () => {
    return {
      store: createKeyv(process.env.REDIS_URL),
    };
  },
};
