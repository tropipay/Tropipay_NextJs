import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataFull from "@/components/DataFull"
import PageClient from "./pageClient"

export default async function Page() {
  const queryConfig = apiConfig.movementsScheduled

  return (
    <DataFull
      {...{
        queryConfig,
        searchParams: { offset: "0", limit: "50" },
        // mockData: movementScheduledMock,
      }}
    >
      <PageClient
        columns={queryConfig.columns}
        tableId={queryConfig.key ?? ""}
      />
    </DataFull>
  )
}
