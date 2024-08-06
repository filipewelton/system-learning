import { defineConfig } from 'tsup'

import { env } from '__configs/environment'

export default defineConfig({
  entry: [
    'src',
    '!src/web/http/routers/*.spec.ts',
    '!src/data/repositories/**/*.spec.ts',
    '!src/data/migrations',
    '!src/data/seeds',
    '!src/domain/use-cases/**/*.spec.ts',
    '!mocks'
  ],
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'build',
  env: {
    NODE_ENV: env.NODE_ENV,
  },
})
