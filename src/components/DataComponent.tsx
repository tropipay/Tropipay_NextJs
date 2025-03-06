"use client"

import { FetchDataConfig } from "@/app/queryDefinitions/types"
import { toastMessage } from "@/lib/uiUtils"
import { useFetchData } from "@/lib/useFetchData"
import { searchParamsToObject } from "@/lib/utils"
import { DehydratedState } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import React from "react"
import { FormattedMessage } from "react-intl"

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
  const urlParams = searchParamsToObject(useSearchParams())
  const { isLoading, data, isError, error } = useFetchData({
    queryConfig,
    dehydratedState,
    urlParams,
  })

  // if (isLoading)
  //   return (
  //     <p>
  //       <FormattedMessage id={"loading"} />
  //     </p>
  //   )
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

      {/* <div className="absolute inset-0 z-10 flex items-center justify-center gap-2 h-screen">
        <Loader2 className="animate-spin text-gray-400" size={40} />
      </div> */}
    </div>
  )
}
