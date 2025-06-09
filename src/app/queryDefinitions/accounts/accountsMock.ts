import { UserBusinessAccount } from "@/types/security/userAccounts"

export const accountsMock: UserBusinessAccount[] = [
  {
    id: 21002,
    accountNumber: "5Z20-T8Y0-22KY-00BM-OGK5",
    userId: "f89833b0-f97b-11eb-bbb1-c19c62049f20",
    alias: "Main Account",
    balance: 32571,
    pendingIn: 275729,
    pendingOut: 0,
    state: 1,
    paymentEntityId: 1,
    currency: "EUR",
    type: 1,
    createdAt: "2025-03-24T05:10:01.739Z",
    updatedAt: "2025-03-24T05:10:01.739Z",
    isDefault: true,
    groupId: 1,
    TropiCards: [],
    services: [
      {
        slug: "GIFT_CARD",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "CRYPTO_TOPUP",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "REMITTANCE",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "MEDIATION_PAYOUT_BUSINESS",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: 100,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "CHARGE_VOUCHER",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "AFFILIATE_COMMISSION",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "MEDIATION_PAYOUT",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "EXPRESS_REMITTANCE",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "CHARGE_USER_CARDS",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: 1600,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "PAY_WITH_TPP",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: 100,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "CRYPTO_SEND",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "DELIVERY",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "POS",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "BUY_TPP_GIFTCARD",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "CONSUME_TPP_GIFTCARD",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "PURCHASE_NAUTA_PLUS",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "TOKENIZE_CARD",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "RECHARGE",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "RECHARGE_TROPICARD",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "CONSUME_TROPICARD",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "WITHDRAW_TROPICARD",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "EXTERNAL_FUNDING_ACCOUNT_TOPUP",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "INTERNAL_CONSUME_TPP_GIFTCARD",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "EXPIRED_GIFTCARD",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "EXPIRED_GIFTCARD_FEE",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "INTERNAL_TRANSFER",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: 100,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "MARKETPLACE",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: null,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "EXTERNAL_TOPUP",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: 100,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "CHARGE_EXTERNAL_CARDS",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: 100,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
      {
        slug: "CHARGE_OTA_CARDS",
        enabled: true,
        allowed_currencies: ["USD", "EUR"],
        limits: {
          min: {
            value: 100,
            currency: "EUR",
          },
          max: {
            value: null,
            currency: "EUR",
          },
        },
      },
    ],
  },
]
