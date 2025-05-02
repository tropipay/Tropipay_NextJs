import { movementsColumnsDef } from "../movementsColumnsDef"

export const movementsDetailColumnsDef: any = {
  ...movementsColumnsDef,
  id: {
    type: "simpleText",
    field: "id",
    hidden: true,
  },
  movementDetail: {
    field: `movementDetail {
				netAmount {
					value
					currency
				}
				concept
				beneficiaryData {
					name
					alias
					account
				}
				senderData {
					name
					lastName
					email
				}
				type
				cardPan
				cardType
				cardCountry
				clientIp
				cardExpirationDate
			}`,
    hidden: true,
  },
}
