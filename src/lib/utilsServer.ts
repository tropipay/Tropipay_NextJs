import { defaultUserSettings } from "@/app/data/settings"
import { UserSettings } from "@/types/security/user"
import { cookies } from "next/headers"

export async function getUserSettingsServer(
  userId: string
): Promise<UserSettings> {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(`userSettings-${userId}`)?.value

  try {
    if (!cookie) {
      return defaultUserSettings
    } else {
      return JSON.parse(cookie)
    }
  } catch (e) {}

  return defaultUserSettings
}

export async function getUserTableSettingsServer(
  userId: string,
  defaultValue: any = null,
  tableId?: string,
  sectionId?: string
): Promise<UserSettings | any> {
  const { tableColumnsSettings: settings } = await getUserSettingsServer(userId)

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
