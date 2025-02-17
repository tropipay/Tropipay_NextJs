import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import PageClient from "./pageClient"
import DataFull from "@/components/DataFull"

export default async function Page() {
  const queryConfig = apiConfig.movements
  return (
    <>
      <DataFull queryConfig={apiConfig.movements}>
        <PageClient columns={apiConfig.movements.columns} />
      </DataFull>
    </>
  )
}
