import { defaultUserSettings } from "@/app/data/defaultUserSettings"
import { getSession } from "next-auth/react"
import CookiesManager from "./cookiesManager"

export const getUser = async () => {
  const session = getSession()
  return await JSON.stringify(session)
}

export const decodeSession = (session?: string) => {
  try {
    return session
      ? JSON.parse(decodeURIComponent(session || "")).sessionData
      : {}
  } catch (e) {
    return {}
  }
}

export const getTokenFromSession = (session?: string): string => {
  const { token } = decodeSession(session)
  return token ?? ""
}

export const getUserSettings = (userId: string): UserSettings =>
  CookiesManager.getInstance().get(
    `userSettings-${userId}`,
    defaultUserSettings
  )
