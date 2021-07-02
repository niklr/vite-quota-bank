import { AppConstants } from './constants'
import { bigNumber } from './util/bigNumber'

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
      this.amountFormatted = this.formatAmount(vite.balance)
    }
  }

  formatAmount(amount: string): string {
    try {
      return bigNumber.toBasic(Number.parseInt(amount), AppConstants.DefaultDecimals);
    } catch (error) {
      return "-1"
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
      this.currentQuotaFormatted = this.formatQuota(data.currentQuota)
      this.maxQuota = data.maxQuota
      this.maxQuotaFormatted = this.formatQuota(data.maxQuota)
      this.stakeAmount = data.stakeAmount
      this.stakeAmountFormatted = this.formatStakeAmount(data.stakeAmount)
    }
  }

  formatQuota(quota: string): string {
    try {
      return bigNumber.toBasic(Number.parseInt(quota) / AppConstants.QuotaPerUT, 0, 3);
    } catch (error) {
      return "-1"
    }
  }

  formatStakeAmount(amount: string): string {
    try {
      return bigNumber.toBasic(Number.parseInt(amount), AppConstants.DefaultDecimals);
    } catch (error) {
      return "-1"
    }
  }
}

export class QuotaRequest {
  address?: string
  message?: string
  amount?: string
  expirationHeight?: string

  constructor(init?: Partial<QuotaRequest>) {
    this.init(init)
  }

  init(data?: any): void {
    if (data) {
      this.address = data.address
      this.message = data.message
      this.amount = data.amount
      this.expirationHeight = data.expirationHeight
    }
  }
}