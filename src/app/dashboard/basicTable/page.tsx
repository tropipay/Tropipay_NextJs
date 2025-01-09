import DataComponent from "@/components/DataComponent"
import UserTable from "@/components/preformatedData/UserTable"
import { QueryClient, dehydrate } from "@tanstack/react-query"
import { fetchData } from "@/lib/fetchData"
import { apiConfig } from "@/app/queryDefinitions/apiConfig"

export default async function Page() {
  const queryClient = new QueryClient()

  await fetchData(queryClient, ["movements"], apiConfig.movements)

  const dehydratedState = dehydrate(queryClient)

  return (
    <>
      <h1>Movements</h1>
      {dehydratedState && (
        <DataComponent
          dehydratedState={dehydratedState}
          endpointKey="movements"
          queryKey={["movements"]}
        >
          <UserTable />
        </DataComponent>
      )}
    </>
  )
}
