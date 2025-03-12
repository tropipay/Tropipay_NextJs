import { defaultUserSettings } from "@/app/data/settings"
import { UserSettings } from "@/types/security/user"
import { getSession } from "next-auth/react"
import CookiesManager from "./cookiesManager"

/**
 * Get user session.
 */
export const getUser = async () => {
  const session = getSession()
  return await JSON.stringify(session)
}

/**
 * Get the session token.
 * @param session User session.
 * @returns Authentication token.
 */
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

/**
 * Get the user settings stored in a cookie.
 * @param userId User identifier.
 * @param defaultValue Default value.
 */
export const getUserSettings = (
  userId: string,
  defaultValue: any = defaultUserSettings
): UserSettings | any => {
  if (userId === undefined) {
    throw new Error("UserId is required to set user settings.")
  }

  return CookiesManager.getInstance().get(
    `userSettings-${userId}`,
    defaultValue
  )
}

/**
 * Get a configuration from a user table settings stored in a cookie.
 * @param userId User identifier.
 * @param defaultValue Default value.
 * @param tableId table identifier.
 * @param sectionId section identifier inside table identifier settings.
 * @returns
 */
export const getUserTableSettings = (
  userId: string,
  defaultValue: any = null,
  tableId?: string,
  sectionId?: string
): UserSettings | any => {
  if (userId === undefined) {
    return defaultValue
  }

  const { tableColumnsSettings: settings } = getUserSettings(userId)

  let result = {}
  if (!tableId) {
    return result
  }

  result = settings[tableId]
  if (!sectionId) {
    return result
  }

  return result[sectionId] ?? defaultValue
}

/**
 * Set a configuration from a user table settings stored in a cookie.
 * @param userId User identifier.
 * @param tableId Table identifier.
 * @param sectionId Configuration section identifier.
 * @param value value for storage.
 */
export const setUserTableSettings = (
  userId: string,
  tableId: string,
  sectionId: string,
  value: any
): void => {
  if (userId === undefined) {
    throw new Error("UserId is required to set user settings.")
  }

  // Obtener la configuración actual del usuario usando getUserSettings
  const userSettings = getUserSettings(userId)

  let updatedSettings
  if (!sectionId) {
    // If sectionId is not provided, the entire table settings is updated.
    updatedSettings = {
      ...userSettings,
      tableColumnsSettings: {
        ...userSettings.tableColumnsSettings,
        [tableId]: value,
      },
    }
  } else {
    // If tableId and sectionId are provided, only the specific section is updated.
    console.log(updatedSettings)
    updatedSettings = {
      ...userSettings,
      tableColumnsSettings: {
        ...userSettings.tableColumnsSettings,
        [tableId]: {
          ...userSettings.tableColumnsSettings[tableId],
          [sectionId]: value,
        },
      },
    }
  }

  // Guardar la configuración actualizada en las cookies
  CookiesManager.getInstance().set(`userSettings-${userId}`, updatedSettings)
}
