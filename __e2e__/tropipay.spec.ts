import { expect, test } from "@playwright/test"
import { setSessionCookie } from "./utils"

test("check page title", async ({ page }) => {
  await setSessionCookie(page)

  await expect(page).toHaveTitle(/Tropipay/)
})
