import { UserSettings } from "@/types/security/user"
import { getSession } from "next-auth/react"
import CookiesManager from "./cookiesManager"

export const getUser = async () => {
  const session = getSession()
  return await JSON.stringify(session)
}

export const getTokenFromSession = (session?: any): string => {
  try {
    const {
      sessionData: { token },
    } = session

    return token ?? ""
  } catch (e) {
    return ""
  }
}

export const getUserSettings = (
  userId: string,
  defaultValue: any = {},
  tableId?: string,
  sectionId?: string
): UserSettings | any => {
  if (!userId) return defaultValue
  const cookies = CookiesManager.getInstance().get(
    `userSettings-${userId}`,
    defaultValue
  )
  const settings = cookies?.tableColumnsSettings
  if (!settings) return defaultValue

  if (!tableId) {
    return settings
  }

  if (!settings[tableId]) {
    return defaultValue
  }

  if (!sectionId) {
    return settings[tableId]
  }

  return settings[tableId][sectionId] || defaultValue
}

export const setUserSettings = (
  userId: string,
  value: any,
  tableId?: string,
  sectionId?: string
): void => {
  const currentSettings = getUserSettings(userId, {})
  const updatedSettings = {}

  if (!tableId) {
    // Si no se proporciona tableId, se reemplaza toda la configuración
    updatedSettings["tableColumnsSettings"] = value
  } else if (!sectionId) {
    // Si no se proporciona sectionId, se actualiza la tabla completa
    updatedSettings["tableColumnsSettings"] = {
      ...currentSettings,
      [tableId]: value,
    }
  } else {
    // Si se proporcionan tableId y sectionId, se actualiza solo la sección específica
    updatedSettings["tableColumnsSettings"] = {
      ...currentSettings,
      [tableId]: {
        ...currentSettings[tableId],
        [sectionId]: value,
      },
    }
  }

  // Guardar la configuración actualizada en las cookies
  CookiesManager.getInstance().set(`userSettings-${userId}`, updatedSettings)
}
