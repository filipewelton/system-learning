#! /bin/bash

npm install --include=dev
npm run knex migrate:rollback --all
npm run knex migrate:latest
npx tsx scripts/cache-cleanup.ts
npm run knex seed:run
npx tsup --env.NODE_ENV production
