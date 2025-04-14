"use server"

import { signIn } from "@/auth"
import { deleteAuthSessionCookies } from "@/utils/api/utilsServer"

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
