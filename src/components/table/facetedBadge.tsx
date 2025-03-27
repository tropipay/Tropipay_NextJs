import { FormattedMessage } from "react-intl"
import { Badge } from "../ui/badge"

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

  return (
    // @ts-expect-error
    <Badge variant={stateVariant}>
      <span className="mx-1 min-w-[72px] ">
        <FormattedMessage id={currentState.label} />
      </span>
      <Icon className="h-4 w-4 mr-1" />
    </Badge>
  )
}

export default FacetedBadge
