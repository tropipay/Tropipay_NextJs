import { UserSettings } from "@/types/security/user"

export const defaultUserSettings: UserSettings = {
  tableColumnsSettings: {
    movements: {
      columnOrder: [
        "select",
        "createdAt",
        "amountCharged",
        "state",
        "sender",
        "movementType",
        "concept",
        "bankOrderCode",
      ],
      columnSorting: [],
    },
  },
}
