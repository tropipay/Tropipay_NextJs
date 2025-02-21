import GiftcardIcon from "@/components/images/giftcardIcon"
import TropicardIcon from "@/components/images/tropicardIcon"
import TropipayIcon from "@/components/images/tropipayIcon"
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"
import {
  Banknote,
  Building2,
  Check,
  CircleDollarSign,
  Clock4,
  CreditCard,
  HandCoins,
  Landmark,
  LoaderCircle,
  Store,
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
    value: "charged",
    icon: LoaderCircle,
  },
  {
    value: "paid",
    icon: Check,
  },
  {
    value: "pendingIn",
    icon: Clock4,
  },
  {
    value: "cancelled",
    icon: CrossCircledIcon,
  },
].map((option) => ({ ...option, label: `ms_${option.value}` }))

export const movementsStateGroups = {
  completedStates: ["charged", "paid"],
  processingStates: ["pendingIn", "processing", "onReview"],
  anotherStates: ["error"],
}
export const movementTypes = [
  "add",
  "ota",
  "phoneRecharge",
  "giftcard",
  "remittance",
  "refund",
  "transfer",
  "charge",
  "payment",
  "other",
].map((value) => ({ value, label: `mt_${value}` }))

export const paymentMethods = [
  {
    value: "CHARGE_USER_CARDS",
    icon: CreditCard,
  },
  {
    value: "TOKENIZE_CARD",
    icon: CreditCard,
  },
  {
    value: "GIFT_CARD",
    icon: GiftcardIcon,
  },
  {
    value: "CONSUME_TROPICARD",
    icon: TropicardIcon,
  },
  {
    value: "CHARGE_EXTERNAL_CARDS",
    icon: CreditCard,
  },
  {
    value: "INTERNAL_TRANSFER",
    icon: Banknote,
  },
  {
    value: "MARKETPLACE",
    icon: Store,
  },
  {
    value: "REMITTANCE",
    icon: HandCoins,
  },
  {
    value: "RECHARGE",
    icon: CircleDollarSign,
  },
  {
    value: "RECHARGE_TROPICARD",
    icon: TropicardIcon,
  },
  {
    value: "PAY_WITH_TPP",
    icon: TropicardIcon,
  },
  {
    value: "MEDIATION_PAYOUT_BUSINESS",
    icon: Building2,
  },
  {
    value: "Tropipay Balance",
    icon: TropipayIcon,
  },
  {
    value: "Deposit Bank",
    icon: Landmark,
  },
].map((option) => ({ ...option, label: `pm_${option.value}` }))
