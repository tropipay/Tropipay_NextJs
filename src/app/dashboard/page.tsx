import { QueryClient, dehydrate } from "@tanstack/react-query"
import DataComponent from "../components/DataComponent"
import UserTable from "../components/preformatedData/UserTable"
import { fetchGetWithTriggers } from "@/lib/utils"

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
      <h1>Bienvenido al Dashboard</h1>
    </>
  )
}
