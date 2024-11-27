import DataTable from "@/app/components/table/dataTable"
import { movementColumns } from "@/app/queryDefinitions/movements/movementColumns"
import { movements } from "@/app/queryDefinitions/movements/movements"

export default async function Home() {
  // This is where you would fetch external data:
  // const exampleExternalData = await fetchExternalDataFunction();

  // In our example we use local data
  return (
    <div className="container p-2">
      <DataTable data={movements} columns={movementColumns} />
    </div>
  )
}
