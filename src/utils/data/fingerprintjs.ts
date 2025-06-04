import FingerprintJS from "@fingerprintjs/fingerprintjs"
import Cookies from "js-cookie"

const DEVICE_ID_COOKIE_NAME: string = "tppdID"
const DEVICE_ID_COOKIE_EXPIRY_DAYS: number = 30

/**
 * Retrieves the device ID from the cookie or generates a new one using FingerprintJS.
 * @returns {Promise<string | null>} The device ID or null if an error occurred.
 */
export async function getDeviceId(): Promise<string | null> {
  const fingerprintJsPromise = FingerprintJS.load({
    monitoring: false,
  })
  let deviceId: string | null = Cookies.get(DEVICE_ID_COOKIE_NAME) || null
  if (deviceId) {
    return deviceId
  }
  try {
    const fingerprint = await fingerprintJsPromise
    const fingerprintResult = await fingerprint.get()
    deviceId = fingerprintResult.visitorId
    // Save cookie
    Cookies.set(DEVICE_ID_COOKIE_NAME, deviceId, {
      expires: DEVICE_ID_COOKIE_EXPIRY_DAYS,
      secure: true,
      sameSite: "strict",
    })
    return deviceId
  } catch (error) {
    console.error("Failed to get fingerprint:", error)
    return null
  }
}

export default { getDeviceId }
