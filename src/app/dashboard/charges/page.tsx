import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import { chargesMock } from "@/app/queryDefinitions/charges/chargesMock"
import DataFull from "@/components/DataFull"
import PageClient from "./pageClient"

interface Props {
  searchParams: { [key: string]: string }
}

export default async function Page({ searchParams }: Props) {
  const { charges: queryConfig } = apiConfig
  const { columns, key } = queryConfig

  return (
    <DataFull
      {...{
        queryConfig,
        searchParams,
        mockData: { data: { charges: chargesMock } },
      }}
    >
      <PageClient
        {...{
          columns,
          tableId: key ?? "",
        }}
      />
    </DataFull>
  )
}
