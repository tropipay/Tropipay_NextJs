import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataComponent from "@/components/DataComponent"
import { fetchData } from "@/lib/fetchData"
import { processQueryParameters } from "@/lib/utils"
import { dehydrate, QueryClient } from "@tanstack/react-query"
import PageClient from "./pageClient"
import DataFull from "@/components/DataFull"

interface Props {
  searchParams: { [key: string]: string }
}

export default async function Page({ searchParams }: Props) {
  const queryConfig = apiConfig.movements

  return (
    <DataFull queryConfig={queryConfig} searchParams={searchParams}>
      <PageClient columns={queryConfig.columns} />
    </DataFull>
  )
}
