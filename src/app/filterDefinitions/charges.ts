import { CrossCircledIcon } from "@radix-ui/react-icons"
import { Check, CircleHelp, X } from "lucide-react"

export const chargeStates = [
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
  {
    value: "error",
    icon: CrossCircledIcon,
  },
].map((option) => ({ ...option, label: `cs_${option.value}` }))

export const chargeStatesGroups = {
  completedStates: ["caught"],
  anotherStates: ["declined", "refunded", "refunded_partial"],
  errorStates: ["error"],
}

export const chargeTypes = [{ value: "OTHER", icon: CircleHelp }].map(
  (option) => ({ ...option, label: `ct_${option.value}` })
)

export const chargeProductTypes = [
  { value: "WEB_APP" },
  { value: "API" },
  { value: "WOOCOMMERCE" },
  { value: "PRESTASHOP" },
  { value: "DRUPAL" },
  { value: "ODOO" },
  { value: "BUSINESS_PAGE" },
  { value: "QR" },
  { value: "BUSINESS_PAGE_ONLINE" },
  { value: "OTHER" },
].map((option) => ({ ...option, label: `cp_${option.value}` }))
