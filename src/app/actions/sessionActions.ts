"use server"

import { signIn } from "@/auth"

export const login = async (token: string) =>
  await signIn("credentials", {
    redirect: false,
    token,
  })
