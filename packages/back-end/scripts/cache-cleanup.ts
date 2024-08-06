import { cache } from '__providers/cache'

async function run() {
  await cache.flushall().finally(() => process.exit(0))
}

run()
