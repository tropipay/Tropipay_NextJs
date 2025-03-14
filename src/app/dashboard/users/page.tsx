import { userColumns } from "@/app/queryDefinitions/users/userColumns"
import { users } from "@/app/queryDefinitions/users/users"
import DataTable from "@/components/table/dataTable"

export default async function Home() {
  // This is where you would fetch external data:
  // const exampleExternalData = await fetchExternalDataFunction();

  // In our example we use local data
  return (
    <div className="container p-2">
      <DataTable
        tableId="users"
        data={users}
        columns={userColumns}
        userId="0"
      />
    </div>
  )
}
