import { defaultUserSettings } from "@/app/data/settings"
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
  defaultValue: any = defaultUserSettings,
  tableId?: string,
  sectionId?: string
): UserSettings | any => {
  if (userId === undefined) {
    return defaultValue
  }

  const settings = CookiesManager.getInstance().get(
    `userSettings-${userId}`,
    defaultValue
  )

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
  value: any, // Valor a almacenar o actualizar
  tableId?: string, // Identificador de la tabla (opcional)
  sectionId?: string // Identificador de la sección (opcional)
): void => {
  if (userId === undefined) {
    throw new Error("UserId is required to set user settings.")
  }

  // Obtener la configuración actual del usuario usando getUserSettings
  const currentSettings = getUserSettings(userId, {})

  let updatedSettings

  if (!tableId) {
    // Si no se proporciona tableId, se reemplaza toda la configuración
    updatedSettings = value
  } else if (!sectionId) {
    // Si no se proporciona sectionId, se actualiza la tabla completa
    updatedSettings = {
      ...currentSettings,
      [tableId]: value,
    }
  } else {
    // Si se proporcionan tableId y sectionId, se actualiza solo la sección específica
    updatedSettings = {
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
