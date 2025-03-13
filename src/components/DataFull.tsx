import DataComponent from "@/components/DataComponent"
import { fetchData } from "@/lib/fetchData"
import { processQueryParameters } from "@/lib/utils"
import { dehydrate } from "@tanstack/react-query"
import getQueryClient from "./getQueryClient"
interface DataFullProps {
  queryConfig: any
  children: React.ReactNode
  searchParams?: { [key: string]: string }
}

export default async function DataFull({
  queryConfig,
  children,
  searchParams = {},
}: DataFullProps) {
  const queryClient = getQueryClient()
  const urlParams = await processQueryParameters(searchParams)
  await fetchData(queryClient, queryConfig, urlParams)
  const dehydratedState = dehydrate(queryClient)
  /*   console.log(
    "dehydratedState:",
    dehydratedState?.queries[0].state.status,
    dehydratedState?.queries[0].queryKey[0],
    dehydratedState?.queries[0].state.data.data.movements.items
  )
 */ return (
    <>
      {dehydratedState && (
        <DataComponent
          dehydratedState={dehydratedState}
          queryConfig={queryConfig}
          key={queryConfig.key}
        >
          <>{children}</>
        </DataComponent>
      )}
    </>
  )
}
