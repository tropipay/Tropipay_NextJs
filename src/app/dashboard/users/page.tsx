import DataTable from "@/components/table/dataTable"
import { userColumns } from "@/app/queryDefinitions/users/userColumns"
import { users } from "@/app/queryDefinitions/users/users"

export default async function Home() {
  // This is where you would fetch external data:
  // const exampleExternalData = await fetchExternalDataFunction();

  // In our example we use local data
  return (
    <div className="container p-2">
      <DataTable data={users} columns={userColumns} />
    </div>
  )
}
