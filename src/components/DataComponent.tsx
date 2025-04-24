"use client"

import { FetchDataConfig } from "@/types/fetchData"
import { useFetchData } from "@/utils/data/useFetchData"
import { DehydratedState } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { cloneElement, ReactElement, ReactNode } from "react"
import { FormattedMessage } from "react-intl"
import ErrorMessage from "./ErrorMessage"

interface DataChildProps {
  data: any
  userId?: string
}

interface DataComponentProps {
  dehydratedState?: DehydratedState
  children: ReactElement<DataChildProps>
  queryConfig: FetchDataConfig
  searchParams?: { [key: string]: string }
  mockData?: any
  showLoading?: boolean
  showError?: boolean
  loader?: ReactNode
}

export default function DataComponent({
  dehydratedState,
  queryConfig,
  searchParams = {},
  mockData,
  children,
  showLoading = false,
  showError = true,
  loader = <Loader2 className="animate-spin text-[#041266]" size={72} />,
}: DataComponentProps) {
  const urlParams = searchParams
  const {
    data: fetchData,
    isLoading,
    isFetching,
    isError,
  } = useFetchData({
    queryConfig,
    dehydratedState,
    urlParams,
    enabled: !mockData,
  })
  const { data: session } = useSession()
  const userId = session?.user?.id
  const loading = isLoading || isFetching
  const data = mockData ?? fetchData

  return (
    <div className={`w-full ${loading && "opacity-70 pointer-events-none"}`}>
      {showLoading && loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9998]">
          {loader}
        </div>
      )}
      {isError && showError && (
        <div className="w-full max-w-[500px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <ErrorMessage>
            <FormattedMessage id="loading_data_error" />
          </ErrorMessage>
        </div>
      )}
      {userId && data && !isError && cloneElement(children, { data, userId })}
    </div>
  )
}
function awaitprocessQueryParameters(searchParams: { [key: string]: string }) {
  throw new Error("Function not implemented.")
}
