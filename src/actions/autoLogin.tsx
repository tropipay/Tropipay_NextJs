"use server"
import { signIn } from "next-auth/react"

export const autoLogin = async () => {
  try {
    await signIn("credentials", {
      token: "123",
    })
  } catch (error) {
    console.error(error)
  }
}
