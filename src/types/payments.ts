type Payment = {
  id: string
  createdAt: string
  completedAt: string
  amount: Amount
  paymentMethod: string
  state: string
  reference: string
  errorCode: string
  product: string
  email: string
  cardPan: string
  cardBin: string
  paymentType: string
  cardHolderName: string
  cardIssuerBank: string
  cardType: string
}

type GetPaymentsResponse = {
  data: { payments: ApiDataResponse<Payment> }
}
