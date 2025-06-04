"use server"

import { signIn, signOut } from "@/auth"
import { env } from "@/config/env"
import { deleteAuthSessionCookies } from "@/utils/api/utilsServer"
import { getDeviceId } from "@/utils/data/fingerprintjs"
import { fetchHeaders } from "@/utils/data/utils"
import axios from "axios"

/**
 * sign in with Next Auth.
 * All authentication cookies are previously deleted.
 * @param token Authentication token.
 */
export const login = async (token: string) => {
  await deleteAuthSessionCookies()

  try {
    return await signIn("credentials", {
      redirect: false,
      token,
    })
  } catch (error: any) {
    return { error: error?.message || "Failed to sign in." }
  }
}

export const getUserProfile = async (token) => {
  const deviceId = await getDeviceId()

  return axios(`${env.API_URL}/api/v3/users/profile`, {
    headers: {
      ...fetchHeaders,
      Authorization: `Bearer ${token}`,
      "X-DEVICE-ID": deviceId || "",
    },
    validateStatus: (status) => status >= 200 && status < 300,
  })
}

export const logout = async () => {
  await deleteAuthSessionCookies()
  await signOut({ redirect: false })
}
