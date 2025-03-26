import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import { paymentsMock } from "@/app/queryDefinitions/payments/paymentsMock"
import DataFull from "@/components/DataFull"
import PageClient from "./pageClient"

interface Props {
  searchParams: { [key: string]: string }
}

export default async function Page({ searchParams }: Props) {
  const { payments: queryConfig } = apiConfig
  const { columns, key } = queryConfig

  return (
    <DataFull
      {...{
        queryConfig,
        searchParams,
        mockData: { data: { payments: paymentsMock } },
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
