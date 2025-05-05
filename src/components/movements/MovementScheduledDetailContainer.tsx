"use client"

import MovementScheduledDetail from "./MovementScheduledDetail"

interface Props {
  row: any
}

const MovementScheduledDetailContainer = ({ row }: Props) => (
  <MovementScheduledDetail {...{ data: row }} />
)

export default MovementScheduledDetailContainer
