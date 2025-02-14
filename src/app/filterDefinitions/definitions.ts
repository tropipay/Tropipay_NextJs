import BankIcon from "@/components/images/bankIcon"
import CreditcardIcon from "@/components/images/creditcardIcon"
import GiftcardIcon from "@/components/images/giftcardIcon"
import TropicardIcon from "@/components/images/tropicardIcon"
import TropipayIcon from "@/components/images/tropipayIcon"
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"
import { Check, Clock4, CornerUpLeft, LoaderCircle } from "lucide-react"

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
    value: "new",
    label: "new",
    icon: Clock4,
  },
  {
    value: "charged",
    label: "charged",
    icon: LoaderCircle,
  },
  {
    value: "paid",
    label: "paid",
    icon: Check,
  },
  {
    value: "error",
    label: "error",
    icon: CornerUpLeft,
  },
  {
    value: "pendingIn",
    label: "pendingIn",
    icon: CrossCircledIcon,
  },
  {
    value: "cancelled",
    label: "cancelled",
    icon: CrossCircledIcon,
  },
  {
    value: "preauthorized",
    label: "preauthorized",
    icon: Check,
  },
  {
    value: "blocked",
    label: "blocked",
    icon: Check,
  },
  {
    value: "guarded",
    label: "guarded",
    icon: Check,
  },
  {
    value: "guardedSend",
    label: "guardedSend",
    icon: Check,
  },
  {
    value: "guardedMediation",
    label: "guardedMediation",
    icon: Check,
  },
  {
    value: "onReview",
    label: "onReview",
    icon: Check,
  },
  {
    value: "processing",
    label: "processing",
    icon: Clock4,
  },
  {
    value: "annulated",
    label: "annulated",
    icon: Check,
  },
]
export const movementsStateGroups = {
  completedStates: ["charged", "paid"],
  processingStates: ["pendingIn", "processing", "onReview"],
  anotherStates: ["error"],
}
export const movementTypes = [
  {
    value: "chargeUserCards",
    label: "chargeUserCards",
  },
  {
    value: "internalTransfer",
    label: "internalTransfer",
  },
  {
    value: "consumeTropicard",
    label: "consumeTropicard",
  },
  {
    value: "giftCard",
    label: "giftCard",
  },
  {
    value: "chargeExternalCards",
    label: "chargeExternalCards",
  },
  {
    value: "rechargeTropicard",
    label: "rechargeTropicard",
  },
  {
    value: "cryptoTopup",
    label: "cryptoTopup",
  },
  {
    value: "unknown",
    label: "unknown",
  },
  {
    value: "externalTransfer",
    label: "externalTransfer",
  },
  {
    value: "remittance",
    label: "remittance",
  },
]
export const paymentMethods = [
  {
    value: "CHARGE_USER_CARDS",
    label: "Tarjeta de crédito",
    icon: CreditcardIcon,
  },
  {
    value: "TOKENIZE_CARD",
    label: "Tarjeta tokenizada",
    icon: CreditcardIcon,
  },
  {
    value: "Tropipay Balance",
    label: "Saldo TropiPay",
    icon: TropipayIcon,
  },
  {
    value: "GIFT_CARD",
    label: "Giftcard",
    icon: GiftcardIcon,
  },
  {
    value: "Deposit Bank",
    label: "Deposito Bancario",
    icon: BankIcon,
  },
  {
    value: "CONSUME_TROPICARD",
    label: "TropiCard",
    icon: TropicardIcon,
  },
  {
    value: "CHARGE_EXTERNAL_CARDS",
    label: "CHARGE_EXTERNAL_CARDS",
  },
  {
    value: "INTERNAL_TRANSFER",
    label: "INTERNAL_TRANSFER",
  },
  {
    value: "MARKETPLACE",
    label: "MARKETPLACE",
  },
  {
    value: "REMITTANCE",
    label: "REMITTANCE",
  },
  {
    value: "RECHARGE_TROPICARD",
    label: "RECHARGE_TROPICARD",
  },
]
