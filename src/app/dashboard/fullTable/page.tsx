import { users } from "@/app/users/users"
import { columns } from "@/app/components/table/columns"
import DataTable from "@/app/components/table/dataTable"

export default async function Home() {
  // This is where you would fetch external data:
  // const exampleExternalData = await fetchExternalDataFunction();

  // In our example we use local data
  return (
    <div className="container p-2">
      <DataTable data={users} columns={columns} />
    </div>
  )
}
