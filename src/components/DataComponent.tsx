"use client"

import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { useFetchData } from "@/lib/useFetchData"
import { searchParamsToObject } from "@/lib/utils"
import { DehydratedState } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import React from "react"
import { FormattedMessage } from "react-intl"

interface DataComponentProps {
  dehydratedState: DehydratedState
  children: React.ReactElement<{ data: any }>
  filters: any
  queryConfig: FetchDataConfig
}

export default function DataComponent({
  dehydratedState,
  queryConfig,
  children,
}: DataComponentProps) {
  const urlParams = searchParamsToObject(useSearchParams())
  const { data, error, isLoading } = useFetchData({
    queryConfig,
    dehydratedState,
    urlParams,
  })

  if (isLoading)
    return (
      <p>
        <FormattedMessage id={"loading"} />
      </p>
    )
  if (error) return <p>Error: {error.message}</p>

  return React.cloneElement(children, { data })
}
