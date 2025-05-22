import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataFull from "@/components/DataFull"
import PageClient from "./pageClient"
import { Suspense } from "react"

interface Props {
  searchParams: { [key: string]: string }
}

export default async function Page({ searchParams }: Props) {
  const queryConfig = apiConfig.movements

  return (
    <Suspense>
      <DataFull
        {...{
          queryConfig,
          searchParams,
        }}
      >
        <PageClient
          columns={queryConfig.columns}
          tableId={queryConfig.key ?? ""}
        />
      </DataFull>
    </Suspense>
  )
}
