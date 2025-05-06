import BankIcon from "@/components/images/BankIcon"
import GiftcardIcon from "@/components/images/GiftcardIcon"
import OtaIcon from "@/components/images/OtaIcon"
import PhoneRechargeIcon from "@/components/images/PhoneRechargeIcon"
import RefundIcon from "@/components/images/RefundIcon"
import RemittanceIcon from "@/components/images/RemittanceIcon"
import TropicardIcon from "@/components/images/TropicardIcon"
import TropipayIcon from "@/components/images/TropipayIcon"
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

export const movementScheduledStates = [
  {
    value: 1,
  },
  {
    value: 2,
  },
  {
    value: 3,
  },
].map((option) => ({ ...option, label: `sched_ms_${option.value}` }))

export const movementStateGroups = {
  completedStates: ["completed"],
  processingStates: ["pending", "processing"],
  anotherStates: ["cancelled", 1, 2, 3],
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

export const movementsScheduledRecurrences = [
  {
    value: 1,
  },
  {
    value: 2,
  },
  {
    value: 3,
  },
  {
    value: 4,
  },
  {
    value: 5,
  },
].map((option) => ({ ...option, label: `mr_${option.value}` }))
