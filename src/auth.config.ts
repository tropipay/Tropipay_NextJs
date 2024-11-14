import Credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"

export default {
  providers: [
    Credentials({
      credentials: {
        token: {},
      },
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
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.logo,
            lang: user.lang,
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
    async redirect({ url, baseUrl }) {
      console.log("-----------------------url, baseUrl:", url, baseUrl)

      // Redirecciona a `/dashboard` si `url` incluye `signin`
      if (url.includes("/signin")) {
        return `${baseUrl}/dashboard`
      }
      // Redirecciona a `/login` si `url` incluye `signout`
      if (url.includes("/signout")) {
        return `${baseUrl}/login`
      }
      // Si no se cumplen las condiciones anteriores, usa la URL base
      return baseUrl
    },
  },
} satisfies NextAuthConfig
