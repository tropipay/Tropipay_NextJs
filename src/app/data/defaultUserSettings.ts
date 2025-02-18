export const defaultUserSettings: UserSettings = {
  tableColumnsSettings: {
    movements: {
      columnOrder: [
        "select",
        "valueDate",
        "status",
        "amount",
        "movementType",
        "paymentMethod",
        "sender",
        "reference",
      ],
      columnVisibility: {
        location: false,
        otherInformation: false,
      },
      columnSorting: [],
    },
  },
}
