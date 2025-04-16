export interface BalanceSummaryResponse {
  period: {
    startDate: string
    endDate: string
  }
  summary: {
    initialBalance: number
    sales: number
    refunds: number
    commissions: number
    net: number
    finalBalance: number
  }
  commissions: {
    cardFees: number
    internalTransfers: number
    externalTransfers: number
    total: number
  }
  shipments: {
    totalShipments: number
  }
}
