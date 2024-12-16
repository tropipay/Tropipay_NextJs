import { auth } from "@/auth"

export const getUser = async () => {
  const session = await auth()
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
