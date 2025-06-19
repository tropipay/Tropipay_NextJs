import { chromium } from "playwright"
;(async () => {
  const userDataDir = "/tmp"
  const context = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    args: ["--disable-web-security", "--disable-features=site-per-process"],
  })

  const page = await context.newPage()

  // Activates recording mode (similar to codegen)
  await page.pause()

  console.log(
    "Recording mode activated. Perform your actions in the browser..."
  )
})()
