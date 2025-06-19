import { expect, test } from "@playwright/test"
import { setSessionCookie } from "./utils"

test.beforeEach(async ({ page }) => {
  await setSessionCookie(page)
})

test("check page title", async ({ page }) => {
  await expect(page).toHaveTitle(/Tropipay/)
})
