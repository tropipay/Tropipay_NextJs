type Movement = {
  amount: string
  date: string
  type: string
  method: string
  user: string
  bankOrderCode: string
  concept: string
  state: MovementState
}

type MovementState = "Pendiente" | "Procesando" | "Completado" | "Reembolsado"
