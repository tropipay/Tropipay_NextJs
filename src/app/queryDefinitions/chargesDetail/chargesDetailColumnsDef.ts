import { chargesColumnsDef } from "../charges/chargesColumnsDef"

export const chargesDetailColumnsDef: any = {
  ...chargesColumnsDef,
  id: {
    type: "simpleText",
    field: "id",
    hidden: true,
  },
}
