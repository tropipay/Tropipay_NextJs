"use client" // Mark this component as a Client Component

import React, { useEffect } from "react"
import { Provider } from "react-redux"
import { reduxStore } from "@/stores/reduxStore" // Adjust path if necessary
import { useSession } from "next-auth/react"
import ProfileStore from "@/stores/ProfileStore" // Adjust path if necessary

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const currentProfile = ProfileStore.getData("profile")
      if (!currentProfile?.data) {
        ProfileStore.setData("profile", session.user)
      } else {
      }
    }
  }, [status, session]) // Rerun effect if status or session changes

  return <Provider store={reduxStore}>{children}</Provider>
}
