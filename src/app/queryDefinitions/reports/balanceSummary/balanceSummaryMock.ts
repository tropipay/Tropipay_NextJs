import { BalanceSummaryResponse } from "@/types/reports/balanceSummary/balanceSummaryResponse"

export const balanceSummaryMock: BalanceSummaryResponse = {
  period: {
    startDate: "2024-03-01T00:00:00.000Z",
    endDate: "2025-04-01T00:00:00.000Z",
  },
  summary: {
    initialBalance: 0,
    sales: 494883091,
    refunds: 154792,
    commissions: 19804282,
    net: 474924017,
    finalBalance: 474924017,
  },
  commissions: {
    cardFees: 19664392,
    internalTransfers: 0,
    externalTransfers: 0,
    total: 19804282,
  },
  shipments: {
    totalShipments: 0,
  },
}
