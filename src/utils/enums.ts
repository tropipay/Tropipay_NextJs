export const twoFaTypes = {
  GOOGLE_AUTHENTICATOR: 2,
  SMS: 1,
}

export const twoFaEndpointList = {
  PAY_CARD_TOKEN_OK: "/api/v2/tokenized/payment",
  EXPRESS_PAYMENT_OK:
    "/api/v2/business/0aa00000-0aa0-00ed-b4dd-a52d71e00000/pay-express",
  EXTERNAL_PAYOUT_OK: "/api/booking/externalPayout",
}
