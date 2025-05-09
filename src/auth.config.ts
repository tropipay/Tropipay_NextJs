import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { fetchHeaders } from "@/utils/data/utils"
import { processEnvNEXT_PUBLIC_API_URL } from "./utils/config"

export default {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        token: {},
      },
      async authorize({ token }) {
        let user: object | null = null
        try {
          const res = await fetch(
            `${processEnvNEXT_PUBLIC_API_URL}/api/v3/users/profile`,
            {
              method: "GET",
              headers: {
                ...fetchHeaders,
                Authorization: `Bearer ${token}`,
              },
            }
          )

          if (!res.ok) {
            throw new Error(
              `Failed to fetch user profile: ${res.status} ${res.statusText}`
            )
          }

          user = await res.json()
          user = { ...user, token }
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Authorization failed: ${error.message}`)
          } else {
            throw new Error("Authorization failed: Unknown error occurred")
          }
        }

        return user
      },
    }),
  ],

  callbacks: {
    jwt: async ({ token, user }) => ({ ...token, ...user }),

    session: async ({ session, token }) => {
      // Aseguramos que el token esté disponible en la sesión
      if (token) {
        session.user = {
          ...token,
        }
      }

      return session
    },
  },
} satisfies NextAuthConfig
