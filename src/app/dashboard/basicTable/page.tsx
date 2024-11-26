import { QueryClient, dehydrate } from "@tanstack/react-query"
import { fetchGetWithTriggers } from "@/lib/utils"
import DataComponent from "@/app/components/DataComponent"
import UserTable from "@/app/components/preformatedData/UserTable"

export default async function Page() {
  const queryClient = new QueryClient()
  const usersURL = "https://jsonplaceholder.typicode.com/users"

  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: () =>
      fetchGetWithTriggers({
        endpoint: usersURL,
        isPublic: true,
        filter: { active: true },
      }),
  })

  const dehydratedState = dehydrate(queryClient)

  return (
    <>
      <h1>Users</h1>
      <DataComponent
        dehydratedState={dehydratedState}
        queryKey={["users"]}
        fetchURL={usersURL}
        children={<UserTable />}
      />
    </>
  )
}
