import { apiConfig } from "@/app/queryDefinitions/apiConfig"
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
