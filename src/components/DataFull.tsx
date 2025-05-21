import DataComponent from "@/components/DataComponent"
import ErrorMessage from "@/components/ErrorMessage"
import { fetchData } from "@/utils/data/fetchData"
import { processQueryParameters } from "@/utils/data/utils"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import getQueryClient from "./GetQueryClient"
interface DataFullProps {
  queryConfig: any
  children: React.ReactNode
  searchParams?: { [key: string]: string }
  mockData?: any
}

export default async function DataFull({
  queryConfig,
  children,
  searchParams = {},
  mockData,
}: DataFullProps) {
  try {
    const queryClient = getQueryClient()
    const urlParams = await processQueryParameters(searchParams)
    await fetchData(queryClient, queryConfig, urlParams)
    const { key } = queryConfig
    const dehydratedState = dehydrate(queryClient)

    return (
      <>
        <HydrationBoundary state={dehydratedState}>
          {dehydratedState ? (
            <DataComponent
              key={key}
              showLoading
              showError
              {...{
                queryConfig,
                searchParams: urlParams,
                mockData,
              }}
            >
              <>{children}</>
            </DataComponent>
          ) : (
            <div> Loading... </div>
          )}
        </HydrationBoundary>
      </>
    )
  } catch (error) {
    return (
      <div className="w-full max-w-[500px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <ErrorMessage>
          {error instanceof Error ? error.message : "Failed to load data"}
        </ErrorMessage>
      </div>
    )
  }
}
