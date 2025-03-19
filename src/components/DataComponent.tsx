"use client"

import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { useFetchData } from "@/lib/useFetchData"
import { DehydratedState } from "@tanstack/react-query"
import { useSession } from "next-auth/react"
import React from "react"
import Spinner from "./spinner"

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
  const loading = isLoading || isFetching

  return (
    <div className="relative">
      <div className="absolute flex items-center justify-center bg-opacity-50 pointer-events-none w-full h-screen z-[9998]">
        {loading && <Spinner />}
      </div>
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
