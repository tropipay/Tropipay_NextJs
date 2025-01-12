import PageClient from "./pageClient"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { fetchData } from "@/lib/fetchData"
import DataComponent from "@/components/DataComponent"
import { apiConfig } from "@/app/queryDefinitions/apiConfig"

export default async function Page() {
  const queryClient = new QueryClient()
  const queryConfig = apiConfig.movements

  await fetchData(queryClient, queryConfig)
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
