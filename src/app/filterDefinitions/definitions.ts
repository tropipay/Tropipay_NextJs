import GiftcardIcon from "@/components/images/giftcardIcon"
import TropicardIcon from "@/components/images/tropicardIcon"
import TropipayIcon from "@/components/images/tropipayIcon"
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"
import {
  Bitcoin,
  Check,
  CircleHelp,
  Clock4,
  CreditCard,
  Landmark,
  LoaderCircle,
} from "lucide-react"

export const usersStatus = [
  {
    value: "active",
    label: "Active",
    icon: CheckCircledIcon,
  },
  {
    value: "inactive",
    label: "Inactive",
    icon: CrossCircledIcon,
  },
]
export const movementsState = [
  {
    value: "processing",
    icon: LoaderCircle,
  },
  {
    value: "completed",
    icon: Check,
  },
  {
    value: "pending",
    icon: Clock4,
  },
  {
    value: "cancelled",
    icon: CrossCircledIcon,
  },
  {
    value: "error",
    icon: CrossCircledIcon,
  },
].map((option) => ({ ...option, label: `ms_${option.value}` }))

export const movementsStateGroups = {
  completedStates: ["completed"],
  processingStates: ["pending", "processing"],
  anotherStates: ["error"],
}
export const movementTypes = [
  "ADD",
  "OTA",
  "PHONERECHARGE",
  "GIFTCARD",
  "REMITTANCE",
  "REFUND",
  "TRANSFER",
  "CHARGE",
  "PAYMENT",
  "OTHER",
].map((value) => ({ value, label: `mt_${value}` }))

export const paymentMethods = [
  {
    value: "CARD",
    icon: CreditCard,
  },
  {
    value: "TROPICARD",
    icon: TropicardIcon,
  },
  {
    value: "GIFTCARD",
    icon: GiftcardIcon,
  },
  {
    value: "INTERNAL",
    icon: TropipayIcon,
  },
  {
    value: "CRYPTO",
    icon: Bitcoin,
  },
  {
    value: "WIRE",
    icon: Landmark,
  },
  {
    value: "OTHER",
    icon: CircleHelp,
  },
].map((option) => ({ ...option, label: `pm_${option.value}` }))
