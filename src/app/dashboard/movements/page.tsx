import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataComponent from "@/components/DataComponent"
import { fetchData } from "@/lib/fetchData"
import { processQueryParameters } from "@/lib/utils"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import PageClient from "./pageClient"

interface Props {
  searchParams: { [key: string]: string }
}

export default async function Page({ searchParams }: Props) {
  const queryClient = new QueryClient()
  const queryConfig = apiConfig.movements
  const urlParams = await processQueryParameters(searchParams)

  await fetchData(queryClient, queryConfig, urlParams)
  const dehydratedState = dehydrate(queryClient)
  return (
    <>
      {dehydratedState && (
        <DataComponent
          dehydratedState={dehydratedState}
          queryConfig={queryConfig}
        >
          <PageClient columns={queryConfig.columns} />
        </DataComponent>
      )}
    </>
  )
}
