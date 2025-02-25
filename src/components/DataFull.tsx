import DataComponent from "@/components/DataComponent"
import { fetchData } from "@/lib/fetchData"
import { processQueryParameters } from "@/lib/utils"
import { QueryClient, dehydrate } from "@tanstack/react-query"

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
  const queryClient = new QueryClient()
  const urlParams = await processQueryParameters(searchParams)
  await fetchData(queryClient, queryConfig, urlParams)
  const dehydratedState = dehydrate(queryClient)

  return (
    <>
      {dehydratedState && (
        <DataComponent
          dehydratedState={dehydratedState}
          queryConfig={queryConfig}
          key={queryConfig.key}
        >
          {children}
        </DataComponent>
      )}
    </>
  )
}
