import { getDeviceId } from "../data/fingerprintjs"

export const fetchApi = async (url, options: any = {}) => {
  const deviceId = await getDeviceId()

  const headers = new Headers(options.headers || {})
  if (deviceId) {
    headers.append("X-DEVICE-ID", deviceId)
  }

  headers.append("Cache-Control", "no-cache, no-store, must-revalidate")
  headers.append("Pragma", "no-cache")
  headers.append("Expires", "0")

  return fetch(url, {
    ...options,
    headers,
  })
}
