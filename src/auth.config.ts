import ProfileStore from "@/stores/ProfileStore"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { getUserProfile } from "./app/actions/sessionActions"

export const clientTypes = {
  PHYSICAL: 1,
  LEGAL: 2,
}

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
          const response = await getUserProfile(token)

          const profileData = response.data

          if (!profileData) {
            throw new Error("Profile data is empty")
          }
          if (profileData.clientTypeId === clientTypes.PHYSICAL) {
            throw new Error("Authorization failed")
          }

          ProfileStore.setData("profile", profileData)

          user = { ...profileData, token }
        } catch (error) {
          console.error("Authorization failed:", error)
          return null
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
