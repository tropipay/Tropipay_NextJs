import DataComponent from "@/components/DataComponent"
import { fetchData } from "@/utils/data/fetchData"
import { processQueryParameters } from "@/utils/data/utils"
import { dehydrate } from "@tanstack/react-query"
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
  const queryClient = getQueryClient()
  const urlParams = await processQueryParameters(searchParams)
  await fetchData(queryClient, queryConfig, urlParams)
  const { key } = queryConfig
  const dehydratedState = dehydrate(queryClient)
  // console.log("dehydratedState:", dehydratedState)
  return (
    <>
      {dehydratedState && (
        <DataComponent
          key={key}
          showLoading
          {...{
            queryConfig,
            dehydratedState,
            searchParams: urlParams,
            mockData,
          }}
        >
          <>{children}</>
        </DataComponent>
      )}
    </>
  )
}
