import { config } from 'dotenv'
import { z } from 'zod'

const { NODE_ENV } = process.env

if (NODE_ENV === 'development') config({ path: '.env' })
else if (NODE_ENV === 'test') config({ path: '.env.test' })

export const env = z
  .object({
    NODE_ENV: z
      .enum(['development', 'test', 'staging', 'production'])
      .default('development'),
    HTTP_SERVER_HOST: z.string(),
    HTTP_SERVER_PORT: z.coerce.number(),
    DATABASE_CLIENT: z.string(),
    DATABASE_URI: z.string(),
    DATABASE_SSL: z.coerce.boolean().optional(),
    JWT_SECRET: z.string(),
    FIREBASE_CLIENT_EMAIL: z.string(),
    FIREBASE_PRIVATE_KEY: z.string(),
    FIREBASE_PROJECT_ID: z.string(),
    FIREBASE_STORAGE_BUCKET: z.string(),
    CACHE_URI: z.string(),
  })
  .parse(process.env)
