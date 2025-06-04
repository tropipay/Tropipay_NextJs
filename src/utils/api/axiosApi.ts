import axios from "axios"
import { getDeviceId } from "../data/fingerprintjs"

const axiosApi = axios.create()

// Interceptor para agregar header
axiosApi.interceptors.request.use(async (config) => {
  const deviceId = await getDeviceId()

  config.headers["X-DEVICE-ID"] = deviceId
  config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
  config.headers["Pragma"] = "no-cache"
  config.headers["Expires"] = "0"

  return config
})

export default axiosApi
