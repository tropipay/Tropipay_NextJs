import DataTable from "@/components/table/dataTable"
import { movementColumns } from "@/app/queryDefinitions/movements/movementColumns"
import { movements } from "@/app/queryDefinitions/movements/movements"

export default async function Home() {
  return (
    <div className="container p-2">
      <DataTable data={movements} columns={movementColumns} />
    </div>
  )
}
