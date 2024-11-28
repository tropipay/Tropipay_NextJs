import { QueryClient, dehydrate } from "@tanstack/react-query"
import DataComponent from "@/components/DataComponent"
import UserTable from "@/components/preformatedData/UserTable"
import { setSSR } from "@/lib/utils"
import { DestinationCountryStore } from "@/app/stores/DestinationCountryStore"

export default async function Page() {
  const queryClient = new QueryClient()
  const DestinationCountryStoreSSR = setSSR(DestinationCountryStore.List)

  await queryClient.prefetchQuery(DestinationCountryStoreSSR)

  const dehydratedState = dehydrate(queryClient)

  return (
    <>
      <h1>Users</h1>
      <DataComponent
        dehydratedState={dehydratedState}
        queryKey={["List"]}
        fetchURL={"http://localhost:3000/api2/countries"}
        children={<UserTable />}
      />
    </>
  )
}
