import React from "react"
import { Badge } from "../ui/badge"

const FacetedBadge = ({ value, states, stateGroups }) => {
  const currentState = states.find((thisState) => thisState.value === value)

  if (!currentState) {
    return value
  }

  const getStateGroup = (state: string) => {
    for (const group in stateGroups) {
      if (stateGroups[group].includes(state)) {
        return group
      }
    }
    return null
  }

  const stateVariant = getStateGroup(value)
  const Icon = currentState.icon

  return (
    <Badge variant={stateVariant}>
      <Icon className="ml-0 h-4 w-4 mr-2" />
      <span className="mr-0">{currentState.label}</span>
    </Badge>
  )
}

export default FacetedBadge
