import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import MovementDetail from "@/components/movements/MovementDetail"
import DataComponent from "../DataComponent"

interface Props {
  row: any
}

const MovementDetailContainer = ({ row: { id } }: Props) => {
  const queryConfig = apiConfig.movementsDetail

  return (
    <DataComponent
      key={queryConfig.key}
      showLoading
      {...{
        queryConfig,
        searchParams: { id },
      }}
      className="h-full"
    >
      <MovementDetail />
    </DataComponent>
  )
}

export default MovementDetailContainer
