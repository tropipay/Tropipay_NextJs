"use client"

import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { useFetchData } from "@/lib/useFetchData"
import { toastMessage } from "@/lib/utilsUI"
import { DehydratedState } from "@tanstack/react-query"
import { redirect, useSearchParams } from "next/navigation"
import React from "react"
import { FormattedMessage } from "react-intl"
import { useTranslation } from "./intl/useTranslation"
import { useSession } from "next-auth/react"

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
  const { t } = useTranslation()
  const urlParams = searchParams
  const { isLoading, data, isError, error } = useFetchData({
    queryConfig,
    dehydratedState,
    urlParams,
  })
  const { data: session } = useSession()
  const userId = session?.user?.id

  const onOk = () => redirect("/")

  /*   if (isError || !data) {
    toastMessage(
      <FormattedMessage id="we_cant_load_movements" />,
      <FormattedMessage id="try_again_later" />,
      "error"
    )
    return
  }
 */ if (userId && data)
    return (
      <div
        className={`relative ${
          isLoading && "animate-pulse pointer-events-none"
        }`}
      >
        {React.cloneElement(children, { data, userId })}
      </div>
    )
}
function awaitprocessQueryParameters(searchParams: { [key: string]: string }) {
  throw new Error("Function not implemented.")
}
