import { AppConstants } from './constants'
import { formatUtil } from './util/formatUtil'

export class Balance {
  private static readonly _defaultValue = "0"

  amount: string = Balance._defaultValue
  amountFormatted: string = Balance._defaultValue

  constructor(init?: Partial<Balance>) {
    this.init(init)
  }

  init(data?: any): void {
    if (data?.balanceInfoMap) {
      const vite = data.balanceInfoMap[AppConstants.ViteTokenId]
      this.amount = vite.balance
      this.amountFormatted = formatUtil.formatAmount(vite.balance)
    }
  }
}

export class Quota {
  private static readonly _defaultValue = "0"

  currentQuota: string = Quota._defaultValue
  currentQuotaFormatted: string = Quota._defaultValue
  maxQuota: string = Quota._defaultValue
  maxQuotaFormatted: string = Quota._defaultValue
  stakeAmount: string = Quota._defaultValue
  stakeAmountFormatted: string = Quota._defaultValue

  constructor(init?: Partial<Quota>) {
    this.init(init)
  }

  init(data?: any): void {
    if (data) {
      this.currentQuota = data.currentQuota
      this.currentQuotaFormatted = formatUtil.formatQuota(data.currentQuota)
      this.maxQuota = data.maxQuota
      this.maxQuotaFormatted = formatUtil.formatQuota(data.maxQuota)
      this.stakeAmount = data.stakeAmount
      this.stakeAmountFormatted = formatUtil.formatAmount(data.stakeAmount)
    }
  }
}

export class QuotaRequest {
  address?: string
  message?: string
  amount?: string
  amountFormatted?: string
  expirationHeight?: string

  constructor(init?: Partial<QuotaRequest>) {
    this.init(init)
  }

  init(data?: any): void {
    if (data) {
      this.address = data.address
      this.message = data.message
      this.amount = data.amount
      this.amountFormatted = formatUtil.formatAmount(data.amount)
      this.expirationHeight = data.expirationHeight
    }
  }
}