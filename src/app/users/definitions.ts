import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"

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

export const usersRole = [
  {
    value: "client",
    label: "Client",
  },
  {
    value: "provider",
    label: "Provider",
  },
]

export const movementsState = [
  {
    value: "pendingIn",
    label: "Pendiente",
    icon: CheckCircledIcon,
  },
  {
    value: "procesing",
    label: "Procesando",
    icon: CrossCircledIcon,
  },
  {
    value: "completed",
    label: "Completado",
    icon: CrossCircledIcon,
  },
  {
    value: "refund",
    label: "Reembolsado",
    icon: CrossCircledIcon,
  },
]
