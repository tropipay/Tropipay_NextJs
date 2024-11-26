import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getUser } from "./utilsUser"

// Función para combinar clases (cn)
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// Función para construir parámetros de consulta (queryParams)
const queryParams = (
  params: Record<string, string | number | boolean>
): string => {
  return Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&")
}

// Tipos para fetchGetData y headerData
interface FetchGetData {
  endpoint: string
  isPublic?: boolean
  filter?: Record<string, string | number | boolean>
}

interface HeaderData {
  [key: string]: string
}

// Función para hacer un fetch GET con triggers
export const fetchGetWithTriggers = async (
  fetchGetData: FetchGetData,
  headerData: HeaderData = {}
): Promise<any> => {
  try {
    // Intenta obtener el usuario; en el servidor puede no estar disponible
    let user
    try {
      user = await getUser()
    } catch (error) {
      console.warn("No se pudo obtener el usuario en el servidor")
      user = {} // Default vacío si no se puede obtener en el servidor
    }

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      "Accept-Language": user?.lang || "en",
    }

    for (const key in headerData) {
      headers[key] = headerData[key]
    }

    /*     let endpoint = `${process.env.REACT_APP_APP_URL || ""}${
      fetchGetData.endpoint
    }`
 */ let endpoint = `${fetchGetData.endpoint}`

    if (!fetchGetData.isPublic) {
      headers.Authorization = `Bearer ${user?.token || ""}`
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
