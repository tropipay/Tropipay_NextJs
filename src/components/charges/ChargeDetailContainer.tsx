"use client"

import { apiConfig } from "@/app/queryDefinitions/apiConfig"
import DataComponent from "@/components/DataComponent"
import { ArrowLeft } from "lucide-react"
import { useEffect, useState } from "react"
import MovementDetailContainer from "../movements/MovementDetailContainer"
import ChargeDetail from "./ChargeDetail"

interface Props {
  row: any
}

const ChargeDetailContainer = ({ row }: Props) => {
  const queryConfig = apiConfig.chargesDetail
  const [movementId, setMovementId] = useState<string | null>(null)

  useEffect(() => {
    setMovementId(null)
  }, [])

  return (
    <>
      {!movementId && (
        <DataComponent
          key={queryConfig.key}
          showLoading
          {...{
            queryConfig,
            searchParams: { id: row.id },
          }}
          className="h-full"
        >
          <ChargeDetail {...{ onChangeMovementId: setMovementId }} />
        </DataComponent>
      )}
      <div
        className={`w-full h-full transition-transform duration-3000 ease-in-out transform  ${
          movementId ? "origin-right translate-x-0" : "translate-x-full"
        }`}
      >
        {movementId && <MovementDetailContainer row={{ id: movementId }} />}
      </div>
      {movementId && (
        <button
          className="absolute top-[22px] left-[40px] rounded-full p-1 bg-gray-200 hover:bg-gray-300"
          onClick={() => setMovementId(null)}
        >
          <ArrowLeft size={20} />
        </button>
      )}
    </>
  )
}

export default ChargeDetailContainer
