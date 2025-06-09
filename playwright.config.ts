import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: './',
  testMatch: ['__e2e__/**/*.spec.ts'],
  globalSetup: './global-setup',
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    timeout: 300 * 1000,
  },
})
