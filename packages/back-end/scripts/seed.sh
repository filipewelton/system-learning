#! /bin/bash

if [ "$NODE_ENV" != "production" ]; then
  NODE_ENV=development
  NODE_ENV=$NODE_ENV npx tsx scripts/database-cleanup.ts
  NODE_ENV=$NODE_ENV npx tsx scripts/cache-cleanup.ts
fi

NODE_ENV=$NODE_ENV npm run knex seed:run
