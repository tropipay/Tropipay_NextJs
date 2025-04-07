"use client"

import { useFetchData } from "@/lib/useFetchData"
import { DehydratedState } from "@tanstack/react-query"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { cloneElement, ReactElement, ReactNode } from "react"
import { FormattedMessage } from "react-intl"

interface DataComponentProps {
  dehydratedState?: DehydratedState
  children: ReactElement<{ data: any }>
  queryConfig: FetchDataConfig
  searchParams?: { [key: string]: string }
  mockData?: any
  showLoading?: boolean
  loader?: ReactNode
}

export default function DataComponent({
  dehydratedState,
  queryConfig,
  searchParams = {},
  mockData,
  children,
  showLoading = false,
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
      {isError && (
        <div className="w-full max-w-[500px] px-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div
            className="flex items-center justify-center bg-red-100 border-red-400 text-red-700 px-4 py-3 rounded"
            role="alert"
          >
            <AlertTriangle className="w-6 h-6 mr-2" />
            <span>
              <FormattedMessage id="loading_data_error" />
            </span>
          </div>
        </div>
      )}
      {userId &&
        data &&
        !isError &&
        // @ts-ignore
        cloneElement(children, { data, userId })}
    </div>
  )
}
function awaitprocessQueryParameters(searchParams: { [key: string]: string }) {
  throw new Error("Function not implemented.")
}
