import axios from "axios"
import { getDeviceId } from "../data/fingerprintjs"

const axiosApi = axios.create()

// Interceptor para agregar header
axiosApi.interceptors.request.use(async (config) => {
  const deviceId = await getDeviceId()
  config.headers["X-DEVICE-ID"] = deviceId
  return config
})

export default axiosApi
