import { AppConstants } from './constants'
import { QuotaRequestExtensions } from './type-extensions'
import { formatUtil } from './util/formatUtil'

export class Contract {
  address!: string
  contractName!: string
  binary!: string
  offChain!: string
  abi!: any[]

  constructor(init?: Partial<Contract>) {
    this.init(init)
  }

  init(data?: any): void {
    if (data) {
      this.contractName = data.contractName
      this.binary = data.binary
      this.offChain = data.offChain
      this.abi = data.abi
    }
  }
}

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
  networkId?: number
  name?: string
  rpcUrl?: string
  connectorUrl?: string
  mock: boolean = false

  constructor(init?: Partial<Network>) {
    this.init(init)
  }

  init(data?: any): void {
    if (data) {
      this.id = data.id
      this.networkId = data.networkId
      this.name = data.name
      this.rpcUrl = data.rpcUrl
      this.connectorUrl = data.connectorUrl
      this.mock = data.mock ?? false
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
  note?: string
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
      this.note = data.note
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
      && this.note === other.note
      && this.amount === other.amount
      && this.amountFormatted === other.amountFormatted
      && this.expirationHeight === other.expirationHeight
      // && this.expirationDate === other.expirationDate
      && this.expirationDateFormatted === other.expirationDateFormatted
      && this.isExpired === other.isExpired
      && this.status === other.status;
  }
}

export interface IVmLog {
  event: string
  topic: string
  args: any
}

export enum VmLogEvent {
  RequestCreated = 'RequestCreated',
  RequestDeleted = 'RequestDeleted'
}