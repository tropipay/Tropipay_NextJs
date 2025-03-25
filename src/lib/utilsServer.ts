import { cookies } from "next/headers"

export async function getUserSettingsServer(
  userId: string,
  defaultValue: any = null,
  tableId?: string,
  sectionId?: string
) {
  if (!userId) return defaultValue
  const cookieStore = await cookies()
  const cookie = cookieStore.get(`userSettings-${userId}`)?.value

  if (!cookie || cookie === "{}") {
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
