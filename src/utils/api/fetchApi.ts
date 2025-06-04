import { getDeviceId } from "../data/fingerprintjs"

export const fetchApi = async (url, options: any = {}) => {
  const deviceId = await getDeviceId()

  const headers = new Headers(options.headers || {})
  if (deviceId) {
    headers.append("X-DEVICE-ID", deviceId)
  }

  return fetch(url, {
    ...options,
    headers,
  })
}
