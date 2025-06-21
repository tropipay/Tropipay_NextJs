import { Page } from "@playwright/test"
import globalSetup from "../../global-setup"

export const user = "developers@tropipay.com"
export const password = "f*s1P4I6$3be"
export const host = "0.0.0.0"
export const port = "3000"
export const baseURL = "http://localhost:3000"

export async function setSessionCookie(page: Page) {
  const sessionCookieValue = await globalSetup()

  await page.goto(baseURL)

  if (sessionCookieValue) {
    await page.context().addCookies([
      {
        name: "session",
        value: sessionCookieValue,
        url: baseURL,
      },
    ])
  }

  await page.reload()
}
