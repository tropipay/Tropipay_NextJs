"use server"

import { signIn } from "@/auth"
import { env } from "@/config/env"
import { deleteAuthSessionCookies } from "@/utils/api/utilsServer"
import { fetchHeaders } from "@/utils/data/utils"
import axios from "axios"

/**
 * sign in with Next Auth.
 * All authentication cookies are previously deleted.
 * @param token Authentication token.
 */
export const login = async (token: string) => {
  await deleteAuthSessionCookies()

  return await signIn("credentials", {
    redirect: false,
    token,
  })
}

export const getUserProfile = async (token) =>
  axios(`${env.API_URL}/api/v3/users/profile`, {
    headers: {
      ...fetchHeaders,
      Authorization: `Bearer ${token}`,
    },
    validateStatus: (status) => status >= 200 && status < 300,
  })
