"use client" // Mark this component as a Client Component

import { reduxStore } from "@/stores/reduxStore" // Adjust path if necessary
import React from "react"
import { Provider } from "react-redux"

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={reduxStore}>{children}</Provider>
}
