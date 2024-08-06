import { Redis } from 'ioredis'

import { env } from '__configs/environment'

class Cache {
  static instance: Redis

  constructor() {
    if (!Cache.instance) {
      Cache.instance = new Redis(env.CACHE_URI, {
        maxRetriesPerRequest: 2,
        keepAlive: 10000,
        retryStrategy(times) {
          const delay = Math.min(times * 500, 3000)
          return delay
        },
      })
    }
  }
}

new Cache()

export const cache = Cache.instance
