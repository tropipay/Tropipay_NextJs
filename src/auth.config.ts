import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { fetchHeaders } from "@/utils/data/utils"
import axios from "axios"
import ProfileStore from "@/stores/ProfileStore"

export default {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        token: {},
      },
      async authorize({ token }) {
        let user: any = null
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v3/users/profile`,
            {
              headers: {
                ...fetchHeaders,
                Authorization: `Bearer ${token}`,
              },
            }
          )

          const profileData = response.data

          if (!profileData) {
            throw new Error("Profile data is empty")
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
