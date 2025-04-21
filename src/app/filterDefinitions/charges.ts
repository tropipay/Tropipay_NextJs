import { Check, CircleHelp, CornerUpLeft, X } from "lucide-react"

export const chargeStates = [
  {
    value: "CAPTURED",
    icon: Check,
  },
  {
    value: "DECLINED",
    icon: X,
  },
  {
    value: "REFUNDED",
    icon: CornerUpLeft,
  },
  {
    value: "PARTIALLY_REFUNDED",
    icon: CornerUpLeft,
  },
  {
    value: "OTHER",
    icon: X,
  },
].map((option) => ({ ...option, label: `cs_${option.value}` }))

export const chargeStatesGroups = {
  completedStates: ["CAPTURED"],
  anotherStates: ["DECLINED", "REFUNDED", "PARTIALLY_REFUNDED", "OTHER"],
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
