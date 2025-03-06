import { UserSettings } from "@/types/security/user"

export const defaultUserSettings: UserSettings = {
  tableColumnsSettings: {
    movements: {
      columnOrder: [
        "select",
        "createdAt",
        "amount",
        "state",
        "sender",
        "movementType",
        "paymentMethod",
        "bankOrderCode",
      ],
      columnSorting: [],
    },
  },
}
