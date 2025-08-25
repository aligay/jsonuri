// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['__test__/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'], // HTML 是关键
      reportsDirectory: './coverage', // 默认也是这个
    },
  },
})
