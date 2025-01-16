import PageClient from "./pageClient"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { fetchData } from "@/lib/fetchData"
import DataComponent from "@/components/DataComponent"
import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import { processQueryParameters } from "@/lib/utils"

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const queryClient = new QueryClient()
  const queryConfig = apiConfig.movements

  const urlParams = await processQueryParameters(searchParams)

  await fetchData(queryClient, queryConfig, urlParams)
  const dehydratedState = dehydrate(queryClient)
  return (
    <>
      {dehydratedState && (
        <DataComponent dehydratedState={dehydratedState} config={queryConfig}>
          <PageClient columns={queryConfig.columns} />
        </DataComponent>
      )}
    </>
  )
}
