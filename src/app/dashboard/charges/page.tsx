import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataFull from "@/components/DataFull"
import PageClient from "./pageClient"
import { Suspense } from "react"

interface Props {
  searchParams: { [key: string]: string }
}

export default async function Page({ searchParams }: Props) {
  const { charges: queryConfig } = apiConfig
  const { columns, key } = queryConfig

  console.log("queryConfig:", queryConfig)
  console.log("columns:", columns)
  console.log("key:", key)

  return (
    <Suspense>
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
    </Suspense>
  )
}
