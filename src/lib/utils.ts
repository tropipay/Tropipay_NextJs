import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getUser } from "./utilsUser"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const queryParams = (params) => {
  return Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&")
}

export const fetchGetWithTriggers = async (fetchGetData, headerData = {}) => {
  try {
    // Obtener sesión directamente
    const user = await getUser()
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Accept-Language": user.lang || "en",
    }

    for (const key in headerData) {
      headers[key] = headerData[key]
    }

    let endpoint = process.env.REACT_APP_APP_URL + fetchGetData.endpoint

    if (!fetchGetData.isPublic) {
      headers.Authorization = "Bearer " + (user.token || "")
    }

    if (fetchGetData.filter) {
      endpoint += "?" + queryParams(fetchGetData.filter)
    }

    const deviceId = "010101" // Simulado, reemplazar con fingerprint si es necesario

    const response = await fetch(endpoint, {
      headers: { ...headers, "X-DEVICE-ID": deviceId },
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }

    return response.json()
  } catch (err) {
    throw err
  }
}
