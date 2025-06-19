import { defineConfig, devices } from "@playwright/test"
import { baseURL, port } from "./__e2e__/utils"

export default defineConfig({
  testDir: "./__e2e__",
  testMatch: ["__e2e__/**/*.spec.ts"],
  globalSetup: "./global-setup",
  webServer: {
    command: `PORT=${port} npm run dev:e2e`,
    url: baseURL,
    timeout: 300 * 1000,
  },
  use: {
    baseURL,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        browserName: "chromium",
        launchOptions: {
          args: ["--disable-web-security", "--disable-site-isolation-trials"],
          headless: true,
        },
      },
    },
  ],
})
