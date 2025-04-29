import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataFull from "@/components/DataFull"
import { processQueryParameters } from "@/utils/data/utils"
import PageClient from "./pageClient"

interface Props {
  searchParams: { [key: string]: string }
}

export default async function Page({ searchParams }: Props) {
  const queryConfig = apiConfig.movementsScheduled
  const urlParams = await processQueryParameters(searchParams)
  const size = urlParams["size"] ?? "50"
  const page = urlParams["page"] ?? "0"

  return (
    <DataFull
      {...{
        queryConfig,
        searchParams: {
          offset: (parseInt(page) * parseInt(size)).toString(),
          limit: size,
        },
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
