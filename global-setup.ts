import { chromium } from "@playwright/test"
import { password, user } from "./__e2e__/utils"

async function globalSetup() {
  const browser = await chromium.launch()
  let page = await browser.newPage()

  // Authenticate
  await page.goto("https://sandbox.tropipay.me/login")
  await page.fill("input#email", user, { timeout: 60000 })
  await page.fill("input#password", password)
  await page.click('button[type="submit"]')
  await page.waitForURL("https://sandbox.tropipay.me/home", { timeout: 5000 })

  // Extract session cookie
  await page.goto("https://sandbox.tropipay.me/home")
  const cookies = await page.context().cookies()
  const sessionCookie = cookies.find((cookie) => cookie.name === "session")

  if (!sessionCookie) {
    console.error("Session cookie not found.")
  }

  await browser.close()
  return sessionCookie?.value
}

export default globalSetup
