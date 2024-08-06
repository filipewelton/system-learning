#! /bin/bash

if [ "$NODE_ENV" != "staging" ]; then
  NODE_ENV="test"
  NODE_ENV=$NODE_ENV npx tsx scripts/database-cleanup.ts
  NODE_ENV=$NODE_ENV npx tsx scripts/cache-cleanup.ts
fi

npx vitest --run --coverage
