import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    bail: 1,
    dir: 'src',
    coverage: {
      provider: 'v8',
      exclude: ['build']
    }
  },
})
