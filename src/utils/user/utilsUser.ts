import { CacheEntry } from "@/stores/appSlice"
import { reduxStore, RootState } from "@/stores/reduxStore"
import { UserSettings } from "@/types/security/user"
import CookiesManager from "@/utils/cookies/cookiesManager"
import { getSession } from "next-auth/react"

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

export const getToken = (): string => {
  if (typeof window === "undefined") return ""
  return getTokenFromSession(
    CookiesManager.getInstance().get(
      "session",
      "fill_with_session_info",
      window.location.hostname === "localhost"
    )
  )
}

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

// Import CacheEntry if it is not already imported globally in the file
// (Assuming that CacheEntry is already imported from './appSlice' at the beginning of the file)
// We could import UserProfile from ProfileStore if it was exported,
// for now we use Record<string, any> or any
type UserProfile = Record<string, any>

const PROFILE_STORE_NAME = "ProfileStore" // Constante para el nombre del store
const PROFILE_CACHE_ID = "profile" // Constante para el ID de caché
const PROFILE_REDUX_KEY = `${PROFILE_STORE_NAME}_${PROFILE_CACHE_ID}` // Clave completa en Redux

/**
 * Gets the user profile data directly from the global Redux state.
 * @returns The user profile object or undefined if not found.
 */
export function getUserStore(): UserProfile | undefined {
  const state = reduxStore.getState() as RootState
  const cacheEntry = state.appData?.appData?.[PROFILE_REDUX_KEY] as
    | CacheEntry<UserProfile>
    | undefined
  return cacheEntry?.data
}
