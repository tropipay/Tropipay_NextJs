// app/components/TanstackProvider.tsx
"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"
import getQueryClient from "./GetQueryClient"

interface TanstackProviderProps {
  children: ReactNode
}

const TanstackProvider: React.FC<TanstackProviderProps> = ({ children }) => {
  const [queryClient] = useState(getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default TanstackProvider
