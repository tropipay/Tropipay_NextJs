import { cookies } from "next/headers"

/**
 * Get the user settings stored in a cookie in server side.
 * @param userId User identifier.
 * @param defaultValue Default value.
 * @param tableId Table identifier.
 * @param sectionId Configuration section identifier.
 */
export async function getUserSettingsServer(
  userId: string,
  defaultValue: any = null,
  tableId?: string,
  sectionId?: string
) {
  if (!userId) return defaultValue
  const cookieStore = await cookies()
  const cookie = cookieStore.get(`userSettings-${userId}`)?.value

  if (!cookie || cookie === "null" || cookie === "{}") {
    return defaultValue
  }
  const jsonCookies = JSON.parse(cookie)
  const settings = jsonCookies.tableColumnsSettings

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
 * Delete all authentication cookies.
 */
export const deleteAuthSessionCookies = async () => {
  const cookieStore = await cookies()
  cookieStore
    .getAll()
    .filter(({ name }) => name.startsWith("authjs"))
    .map(({ name }) => name)
    .forEach((key) => cookieStore.delete(key))
}
