"use server"
import { signIn, signOut } from "@/auth"

export const autoLogin = async (token: string) => {
  try {
    await signIn("credentials", {
      token,
      callbackUrl: "/dashboard",
    })
  } catch (error) {
    console.error(error)
  }
}
export const logout = async () => {
  await signOut()
}
