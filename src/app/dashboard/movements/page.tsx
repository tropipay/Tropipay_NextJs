import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import PageClient from "./pageClient"
import DataFull from "@/components/DataFull"
import { generateQueryFields } from "@/lib/utilsApi"

interface Props {
  searchParams: { [key: string]: string }
}

export default async function Page({ searchParams }: Props) {
  const queryConfig = apiConfig.movements

  return (
    <DataFull queryConfig={queryConfig} searchParams={searchParams}>
      <PageClient columns={queryConfig.columns} tableId={queryConfig.key} />
    </DataFull>
  )
}
