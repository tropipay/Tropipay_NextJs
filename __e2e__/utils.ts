import { Page } from "@playwright/test"
import globalSetup from "../global-setup"

export const user = "developers@tropipay.com"
export const password = "f*s1P4I6$3be"

export async function setSessionCookie(page: Page) {
  const sessionCookieValue = await globalSetup()

  await page.goto("http://localhost:3000")

  if (sessionCookieValue) {
    await page.context().addCookies([
      {
        name: "session",
        value: sessionCookieValue,
        url: "http://localhost:3000",
      },
    ])
  }

  await page.reload()
}
