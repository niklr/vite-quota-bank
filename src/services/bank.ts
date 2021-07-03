import { IViteClient } from '../clients';
import { INetworkStore } from '../stores';
import { QuotaRequest } from '../types';
import { Account, WalletManager } from '../wallet';

export interface IBankService {
  getQuotaRequests(): Promise<string[]>
  getQuotaRequestByAddress(address: string): Promise<QuotaRequest>
  requestQuota(message?: string): Promise<void>
}

export class BankService implements IBankService {

  protected readonly _vite: IViteClient
  protected readonly _networkStore: INetworkStore
  private readonly _walletManager: WalletManager

  constructor(vite: IViteClient, networkStore: INetworkStore, walletManager: WalletManager) {
    this._vite = vite
    this._networkStore = networkStore
    this._walletManager = walletManager
  }

  get account(): Maybe<Account> {
    return this._walletManager.getActiveAccount()
  }

  ensureAccountExists(reject: (reason?: any) => void): void {
    if (this.account?.address === undefined) {
      reject("Login and try again.")
    }
  }

  async getQuotaRequests(): Promise<string[]> {
    return Promise.resolve([])
  }

  async getQuotaRequestByAddress(address: string): Promise<QuotaRequest> {
    return Promise.reject(`Quota request for '${address}' not found.`)
  }

  async requestQuota(message?: string): Promise<void> {
    return Promise.resolve()
  }
}