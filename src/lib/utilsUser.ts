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

export const getUserSettings = (userId: string): UserSettings => {
  return CookiesManager.getInstance().get(`userSettings-${userId}`, null)
}
