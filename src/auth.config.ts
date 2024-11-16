import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        try {
          const res = await fetch("http://localhost:3000/api2/users/profile", {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${credentials.token}`,
            },
          })

          if (!res.ok) {
            throw new Error(
              `Failed to fetch user profile: ${res.status} ${res.statusText}`
            )
          }

          const user = await res.json()
          return {
            ...user,
            token: credentials.token,
          }
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
    async jwt({ token, user }) {
      return { ...token, ...user }
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          ...token,
        }
      }
      return session
    },

    async redirect({ url, baseUrl }) {
      if (url.includes("/signin")) {
        return `${baseUrl}/dashboard`
      }
      if (url.includes("/signout")) {
        return `${baseUrl}/login`
      }
      return baseUrl
    },
  },
} satisfies NextAuthConfig
