import { Check, CircleHelp, X } from "lucide-react"

export const paymentStates = [
  {
    value: "caught",
    icon: Check,
  },
  {
    value: "declined",
    icon: X,
  },
  {
    value: "refunded",
    icon: X,
  },
  {
    value: "refunded_partial",
    icon: X,
  },
].map((option) => ({ ...option, label: `ps_${option.value}` }))

export const paymentStatesGroups = {
  completedStates: ["caught"],
  anotherStates: ["declined", "refunded", "refunded_partial"],
}

export const paymentTypes = [{ value: "OTHER", icon: CircleHelp }].map(
  (option) => ({ ...option, label: `pt_${option.value}` })
)
