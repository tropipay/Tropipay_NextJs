import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export default {
  providers: [
    Credentials({
      async authorize({ token }) {
        try {
          const res = await fetch(
            `${process.env.NEXTAUTH_URL}/api/users/profile`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          )

          if (!res.ok) {
            throw new Error(
              `Failed to fetch user profile: ${res.status} ${res.statusText}`
            )
          }

          return await res.json()
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(`Authorization failed: ${error.message}`)
          } else {
            throw new Error("Authorization failed: Unknown error occurred")
          }
        }
      },
    }),
  ],

  callbacks: {
    async authorized({ auth }) {
      return !!auth
    },

    async jwt({ token, user }) {
      return { ...token, ...user }
    },

    async session({ session, token, user }) {
      if (token) {
        session.user = {
          ...user,
          ...token,
        }
      }
      return session
    },
  },
} satisfies NextAuthConfig
