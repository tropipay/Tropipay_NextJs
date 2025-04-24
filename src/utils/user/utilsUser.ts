import { UserSettings } from "@/types/security/user"
import { getSession } from "next-auth/react"
import CookiesManager from "@/utils/cookies/cookiesManager"
import { reduxStore, RootState } from "@/stores/reduxStore"
import { CacheEntry } from "@/stores/appSlice"

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

export const getToken = (): string =>
  getTokenFromSession(
    CookiesManager.getInstance().get("session", "fill_with_session_info")
  )

/**
 * Get the user settings stored in a cookie.
 * @param userId User identifier.
 * @param defaultValue Default value.
 * @param tableId Table identifier.
 * @param sectionId Configuration section identifier.
 */
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

/**
 * Set a configuration from a user table settings stored in a cookie.
 * @param userId User identifier.
 * @param tableId Table identifier.
 * @param sectionId Configuration section identifier.
 * @param value value for storage.
 */
export const setUserSettings = (
  userId: string,
  value: any,
  tableId?: string,
  sectionId?: string
): void => {
  const currentSettings = getUserSettings(userId, {})
  const updatedSettings = {}

  if (!tableId) {
    // If tableId is not provided, the entire configuration is replaced.
    updatedSettings["tableColumnsSettings"] = value
  } else if (!sectionId) {
    // If sectionId is not provided, the entire table is updated.
    updatedSettings["tableColumnsSettings"] = {
      ...currentSettings,
      [tableId]: value,
    }
  } else {
    // If both tableId and sectionId are provided, only the specific section is updated.
    updatedSettings["tableColumnsSettings"] = {
      ...currentSettings,
      [tableId]: {
        ...currentSettings[tableId],
        [sectionId]: value,
      },
    }
  }

  // Save updated configuration in cookies.
  CookiesManager.getInstance().set(`userSettings-${userId}`, updatedSettings)
}

// --- User Profile Helper ---

// Importar CacheEntry si no está ya importado globalmente en el archivo
// (Asumiendo que CacheEntry ya está importado desde './appSlice' al principio del archivo)
// Podríamos importar UserProfile de ProfileStore si estuviera exportado,
// por ahora usamos Record<string, any> o any
type UserProfile = Record<string, any>

const PROFILE_STORE_NAME = "ProfileStore" // Constante para el nombre del store
const PROFILE_CACHE_ID = "profile" // Constante para el ID de caché
const PROFILE_REDUX_KEY = `${PROFILE_STORE_NAME}_${PROFILE_CACHE_ID}` // Clave completa en Redux

/**
 * Obtiene los datos del perfil de usuario directamente desde el estado global de Redux.
 * @returns El objeto del perfil del usuario o undefined si no se encuentra.
 */
export function getUserStore(): UserProfile | undefined {
  const state = reduxStore.getState() as RootState
  const cacheEntry = state.appData?.appData?.[PROFILE_REDUX_KEY] as
    | CacheEntry<UserProfile>
    | undefined
  return cacheEntry?.data
}
