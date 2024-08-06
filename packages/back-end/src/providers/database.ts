import { Knex, knex } from 'knex'

import { env } from '__configs/environment'

export const config: Knex.Config = {
  connection: {
    connectionString: env.DATABASE_URI,
    ssl: env.DATABASE_SSL,
    query_timeout: 1000,
    keepAlive: true,
  },
  client: env.DATABASE_CLIENT,
  useNullAsDefault: true,
  migrations: {
    directory: 'src/data/migrations',
  },
  seeds: {
    directory: 'src/data/seeds',
  },
}

export const database = knex(config)
