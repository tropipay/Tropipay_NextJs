import { cookies } from "next/headers"

export async function getUserSettingsServer(userId: string) {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(`userSettings-${userId}`)?.value
  return cookie ? JSON.parse(cookie) : null
}
