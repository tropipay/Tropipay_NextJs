"use server"

import { auth, signIn, signOut } from "@/auth"

export const login = async (token: string) =>
  await signIn("credentials", {
    redirect: false,
    token,
  })

export const logout = async () => await signOut({ redirect: true })

export const getSession = async () => await auth()
