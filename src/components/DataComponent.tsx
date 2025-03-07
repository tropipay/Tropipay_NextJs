"use client"

import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { useFetchData } from "@/lib/useFetchData"
import { searchParamsToObject } from "@/lib/utils"
import { DehydratedState } from "@tanstack/react-query"
import { redirect, useSearchParams } from "next/navigation"
import React from "react"
import ErrorHandler from "./errorHandler"
import { useTranslation } from "./intl/useTranslation"
import { toastMessage } from "@/lib/utilsUI"

interface DataComponentProps {
  dehydratedState?: DehydratedState
  children: React.ReactElement<{ data: any }>
  queryConfig: FetchDataConfig
  mockData?: any
}

export default function DataComponent({
  dehydratedState,
  queryConfig,
  mockData,
  children,
}: DataComponentProps) {
  if (!!mockData) {
    return React.cloneElement(children, { data: mockData })
  }
  const { t } = useTranslation()
  const urlParams = searchParamsToObject(useSearchParams())
  const { isLoading, data, isError, error } = useFetchData({
    queryConfig,
    dehydratedState,
    urlParams,
  })

  const onOk = () => redirect("/")

  if (isError || !data) {
    toastMessage(
      <FormattedMessage id="we_cant_load_movements" />,
      <FormattedMessage id="try_again_later" />,
      "error"
    )
    return
  }

  return (
    <div
      className={`relative ${isLoading && "animate-pulse pointer-events-none"}`}
    >
      {React.cloneElement(children, { data })}
    </div>
  )
}
