"use server"
import { signIn, signOut } from "@/auth"

export const autoLogin = async (token: string) => {
  try {
    await signIn("credentials", { redirect: true, token })
  } catch (error) {
    console.error(error)
  }
}
export const logout = async () => {
  await signOut({ redirect: true })
}
