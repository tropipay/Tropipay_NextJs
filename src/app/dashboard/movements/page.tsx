import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import PageClient from "./pageClient"
import DataFull from "@/components/DataFull"

interface Props {
  searchParams: { [key: string]: string }
}

export default async function Page({ searchParams }: Props) {
  const queryConfig = apiConfig.movements
  console.log("queryConfig.columns:", queryConfig.columns)

  return (
    <DataFull queryConfig={queryConfig} searchParams={searchParams}>
      <PageClient columns={queryConfig.columns} />
    </DataFull>
  )
}
