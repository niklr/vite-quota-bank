import { AppConstants } from './constants'
import { bigNumber } from './util/bigNumber'

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