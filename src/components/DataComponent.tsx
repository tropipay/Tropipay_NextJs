"use client"

import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { useFetchData } from "@/lib/useFetchData"
import { DehydratedState } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import React from "react"

interface DataComponentProps {
  dehydratedState?: DehydratedState
  children: React.ReactElement<{ data: any }>
  queryConfig: FetchDataConfig
  searchParams?: { [key: string]: string }
  mockData?: any
}

export default function DataComponent({
  dehydratedState,
  queryConfig,
  searchParams = {},
  mockData,
  children,
}: DataComponentProps) {
  if (!!mockData) {
    return React.cloneElement(children, { data: mockData })
  }
  const urlParams = searchParams
  const { isLoading, data, status, isFetching } = useFetchData({
    queryConfig,
    dehydratedState,
    urlParams,
  })
  const { data: session } = useSession()
  const userId = session?.user?.id
  // const loading = isLoading || isFetching

  return (
    <div>
      {/* Disable loading */}
      {/* className={`relative ${loading && "opacity-70 pointer-events-none"}`} */}
      {/* {loading && (
        <div className="absolute flex items-center justify-center w-full h-screen z-[9998]">
          <Loader2 className="animate-spin text-[#041266]" size={72} />
        </div>
      )} */}
      {userId &&
        data &&
        // @ts-ignore
        React.cloneElement(children, { data, userId })}
    </div>
  )
}
function awaitprocessQueryParameters(searchParams: { [key: string]: string }) {
  throw new Error("Function not implemented.")
}
