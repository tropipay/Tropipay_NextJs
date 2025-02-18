import { defaultUserSettings } from "@/app/data/defaultUserSettings"
import { getSession } from "next-auth/react"
import CookiesManager from "./cookiesManager"

export const getUser = async () => {
  const session = getSession()
  return await JSON.stringify(session)
}

export const getTokenFromSession = (session?: any): string => {
  const {
    sessionData: { token },
  } = session

  return token ?? ""
}

export const getUserSettings = (userId: string): UserSettings =>
  CookiesManager.getInstance().get(
    `userSettings-${userId}`,
    defaultUserSettings
  )
