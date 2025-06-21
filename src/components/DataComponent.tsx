"use client"

import ProfileStore from "@/stores/ProfileStore"
import { FetchDataConfig } from "@/types/fetchData"
import { useFetchData } from "@/utils/data/useFetchData"
import { cn } from "@/utils/data/utils"
import { isProduction } from "@/utils/utils"
import { Loader2 } from "lucide-react"
import { cloneElement, ReactElement, ReactNode } from "react"
import { FormattedMessage } from "react-intl"
import ErrorMessage from "./ErrorMessage"

interface DataChildProps {
  data: any
  userId?: string
}

interface DataComponentProps {
  children: ReactElement<DataChildProps>
  queryConfig: FetchDataConfig
  searchParams?: { [key: string]: string }
  mockData?: any
  showLoading?: boolean
  showError?: boolean
  loader?: ReactNode
  className?: string
}

export default function DataComponent({
  queryConfig,
  searchParams = {},
  mockData,
  children,
  showLoading = false,
  showError = true,
  loader = <Loader2 className="animate-spin text-[#041266]" size={56} />,
  className = "",
}: DataComponentProps) {
  const urlParams = searchParams
  const {
    data: fetchData,
    isLoading,
    isError,
  } = useFetchData({
    queryConfig,
    urlParams,
    enabled: !mockData,
    debug: !isProduction(),
  })
  const userId = (ProfileStore?.getProfileData() as any)?.id
  const loading = isLoading
  const data = mockData ?? fetchData

  return (
    <div
      className={cn(
        "w-full",
        className,
        loading && "opacity-70 pointer-events-none"
      )}
    >
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
