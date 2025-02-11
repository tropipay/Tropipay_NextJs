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
    value: "pendingIn",
    label: "pendingIn",
    icon: Clock4,
  },
  {
    value: "processing",
    label: "processing",
    icon: LoaderCircle,
  },
  {
    value: "paid",
    label: "paid",
    icon: Check,
  },
  {
    value: "refund",
    label: "refund",
    icon: CornerUpLeft,
  },
  {
    value: "failed",
    label: "failed",
    icon: CrossCircledIcon,
  },
  {
    value: "onReview",
    label: "onReview",
    icon: CrossCircledIcon,
  },
  {
    value: "charged",
    label: "charged",
    icon: Check,
  },
]
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
