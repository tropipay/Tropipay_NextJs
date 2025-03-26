import BankIcon from "@/components/images/bankIcon"
import GiftcardIcon from "@/components/images/giftcardIcon"
import OtaIcon from "@/components/images/otaIcon"
import PhoneRechargeIcon from "@/components/images/phoneRechargeIcon"
import RefundIcon from "@/components/images/refundIcon"
import RemittanceIcon from "@/components/images/remittanceIcon"
import TropicardIcon from "@/components/images/tropicardIcon"
import TropipayIcon from "@/components/images/tropipayIcon"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import {
  ArrowUpRight,
  Bitcoin,
  Check,
  CircleHelp,
  Clock4,
  CreditCardIcon,
  LoaderCircle,
  Plus,
  Tag,
  Wallet,
} from "lucide-react"

export const movementStates = [
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

export const movementStateGroups = {
  completedStates: ["completed"],
  processingStates: ["pending", "processing"],
  anotherStates: ["cancelled"],
  errorStates: ["error"],
}

export const movementTypes = [
  { value: "ADD", icon: Plus },
  { value: "OTA", icon: OtaIcon },
  { value: "PHONERECHARGE", icon: PhoneRechargeIcon },
  { value: "GIFTCARD", icon: GiftcardIcon },
  { value: "REMITTANCE", icon: RemittanceIcon },
  { value: "REFUND", icon: RefundIcon },
  { value: "TRANSFER", icon: ArrowUpRight },
  { value: "CHARGE", icon: Tag },
  { value: "PAYMENT", icon: Wallet },
  { value: "OTHER", icon: CircleHelp },
].map((option) => ({ ...option, label: `mt_${option.value}` }))

export const movementsPaymentMethods = [
  {
    value: "CARD",
    icon: CreditCardIcon,
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
    icon: BankIcon,
  },
  {
    value: "OTHER",
    icon: CircleHelp,
  },
].map((option) => ({ ...option, label: `pm_${option.value}` }))
