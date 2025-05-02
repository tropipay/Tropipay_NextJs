import { chargesColumnsDef } from "../chargesColumnsDef"

export const chargesDetailColumnsDef: any = {
  ...chargesColumnsDef,
  id: {
    type: "simpleText",
    field: "id",
    hidden: true,
  },
}
