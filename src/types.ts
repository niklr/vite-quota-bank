import { AppConstants } from './constants'
import { QuotaRequestExtensions } from './type-extensions'
import { formatUtil } from './util/formatUtil'

export class Balance {
  amount: string = AppConstants.DefaultZeroString
  amountFormatted: string = AppConstants.DefaultZeroString

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

export class Network {
  id?: number
  name?: string
  url?: string

  constructor(init?: Partial<Network>) {
    this.init(init)
  }

  init(data?: any): void {
    if (data) {
      this.id = data.id
      this.name = data.name
      this.url = data.url
    }
  }
}

export class Quota {
  currentQuota: string = AppConstants.DefaultZeroString
  currentQuotaFormatted: string = AppConstants.DefaultZeroString
  maxQuota: string = AppConstants.DefaultZeroString
  maxQuotaFormatted: string = AppConstants.DefaultZeroString
  stakeAmount: string = AppConstants.DefaultZeroString
  stakeAmountFormatted: string = AppConstants.DefaultZeroString

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
  expirationDate?: Date
  expirationDateFormatted?: string
  isExpired: boolean = false
  status?: string

  static readonly updater: QuotaRequestExtensions = QuotaRequestExtensions.getInstance()

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
      this.expirationDate = data.expirationDate
      this.expirationDateFormatted = data.expirationDateFormatted
      this.isExpired = data.isExpired
      this.status = data.status
    }
  }

  update(height: string): void {
    QuotaRequest.updater.update(this, height)
  }

  equals(other: QuotaRequest): boolean {
    return this.address === other.address
      && this.message === other.message
      && this.amount === other.amount
      && this.amountFormatted === other.amountFormatted
      && this.expirationHeight === other.expirationHeight
      // && this.expirationDate === other.expirationDate
      && this.expirationDateFormatted === other.expirationDateFormatted
      && this.isExpired === other.isExpired
      && this.status === other.status;
  }
}