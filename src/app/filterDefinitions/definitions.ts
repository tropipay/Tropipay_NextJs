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
    icon: CrossCircledIcon,
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
    icon: null,
  },
  {
    value: "RECHARGE_TROPICARD",
    label: "RECHARGE_TROPICARD",
    icon: null,
  },
]
export const userList = [
  {
    value: "Octavio Benitez",
    label: "Octavio Benitez",
  },
  {
    value: "Daniel Miranda",
    label: "Daniel Miranda",
  },
  {
    value: "Juan López",
    label: "Juan López",
  },
  {
    value: "Felipe Toledo",
    label: "Felipe Toledo",
  },
  {
    value: "Arthur Leon",
    label: "Arthur Leon",
  },
  {
    value: "Sophie Moore",
    label: "Sophie Moore",
  },
  {
    value: "James Carter",
    label: "James Carter",
  },
  {
    value: "Maria Gomez",
    label: "Maria Gomez",
  },
  {
    value: "Liam O'Connor",
    label: "Liam O'Connor",
  },
  {
    value: "Emma Brown",
    label: "Emma Brown",
  },
  {
    value: "Oliver Smith",
    label: "Oliver Smith",
  },
  {
    value: "Sophia Taylor",
    label: "Sophia Taylor",
  },
  {
    value: "William Johnson",
    label: "William Johnson",
  },
  {
    value: "Emily Martinez",
    label: "Emily Martinez",
  },
  {
    value: "Benjamin White",
    label: "Benjamin White",
  },
  {
    value: "Ava Harris",
    label: "Ava Harris",
  },
  {
    value: "Lucas Davis",
    label: "Lucas Davis",
  },
  {
    value: "Isabella Wilson",
    label: "Isabella Wilson",
  },
  {
    value: "Mason Thomas",
    label: "Mason Thomas",
  },
  {
    value: "Mia Lewis",
    label: "Mia Lewis",
  },
  {
    value: "Ethan King",
    label: "Ethan King",
  },
  {
    value: "Amelia Hill",
    label: "Amelia Hill",
  },
  {
    value: "Alexander Scott",
    label: "Alexander Scott",
  },
  {
    value: "Charlotte Lopez",
    label: "Charlotte Lopez",
  },
  {
    value: "Elijah Young",
    label: "Elijah Young",
  },
  {
    value: "Harper Green",
    label: "Harper Green",
  },
  {
    value: "Jacob Baker",
    label: "Jacob Baker",
  },
  {
    value: "Evelyn Gonzalez",
    label: "Evelyn Gonzalez",
  },
  {
    value: "Michael Adams",
    label: "Michael Adams",
  },
  {
    value: "Abigail Mitchell",
    label: "Abigail Mitchell",
  },
  {
    value: "Daniel Carter",
    label: "Daniel Carter",
  },
  {
    value: "Avery Bell",
    label: "Avery Bell",
  },
  {
    value: "Logan Rivera",
    label: "Logan Rivera",
  },
  {
    value: "Ella Brooks",
    label: "Ella Brooks",
  },
]
