import PageClient from "./pageClient"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import { fetchData } from "@/lib/fetchData"
import DataComponent from "@/components/DataComponent"
import { apiConfig } from "@/app/queryDefinitions/apiConfig"

export default async function Page() {
  const queryClient = new QueryClient()
  const movements = apiConfig.movements

  await fetchData(queryClient, movements)
  const dehydratedState = dehydrate(queryClient)

  return (
    <>
      <h1>Movements</h1>
      {dehydratedState && (
        <DataComponent dehydratedState={dehydratedState} config={movements}>
          <PageClient columns={movements.columns} />
        </DataComponent>
      )}
    </>
  )
}
