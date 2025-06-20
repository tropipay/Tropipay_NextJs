import { Badge } from "@/components/ui/Badge"
import { FormattedMessage } from "react-intl"

const FacetedBadge = ({ value, optionList, optionListGroups }) => {
  const currentState = optionList.find((thisState) => thisState.value === value)

  if (!currentState) {
    return value
  }

  const getStateGroup = (state: string) => {
    for (const group in optionListGroups) {
      if (optionListGroups[group].includes(state)) {
        return group
      }
    }
    return null
  }

  const stateVariant = getStateGroup(value)
  const Icon = currentState.icon

  const badgeVariant =
    stateVariant === "processingStates" ||
    stateVariant === "anotherStates" ||
    stateVariant === "completedStates" ||
    stateVariant === "errorStates"
      ? stateVariant
      : "default"

  return (
    <Badge variant={badgeVariant}>
      <span className="mx-1">
        <FormattedMessage id={currentState.label} />
      </span>
      {Icon && <Icon className="h-4 w-4 mr-1" />}
    </Badge>
  )
}

export default FacetedBadge
