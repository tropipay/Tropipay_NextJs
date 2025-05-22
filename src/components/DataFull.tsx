import DataComponent from "@/components/DataComponent"
import { fetchData } from "@/utils/data/fetchData"
import { processQueryParameters } from "@/utils/data/utils"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"
import getQueryClient from "./GetQueryClient"
import { ReactElement } from "react"

interface DataFullProps {
  queryConfig: any
  children: ReactElement
  searchParams?: { [key: string]: string }
  mockData?: any
}

export default async function DataFull({
  queryConfig,
  children,
  searchParams = {},
  mockData,
}: DataFullProps) {
  const queryClient = getQueryClient()
  const urlParams = await processQueryParameters(searchParams)
  await fetchData(queryClient, queryConfig, urlParams)
  const { key } = queryConfig
  const dehydratedState = dehydrate(queryClient)

  console.log("dehydratedState:", dehydratedState)
  return (
    <HydrationBoundary state={dehydratedState}>
      <DataComponent
        key={key}
        showLoading
        {...{
          queryConfig,
          searchParams: urlParams,
          mockData,
        }}
      >
        {children}
      </DataComponent>
    </HydrationBoundary>
  )
}
