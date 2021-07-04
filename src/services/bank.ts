import { IViteClient } from '../clients';
import { IGlobalEmitter } from '../emitters/globalEmitter';
import { INetworkStore } from '../stores';
import { QuotaRequest } from '../types';
import { Account, WalletManager } from '../wallet';

export interface IBankService {
  init(contractAddress: string): void
  dispose(): void
  getQuotaRequests(): Promise<string[]>
  getQuotaRequestByAddress(address: string): Promise<QuotaRequest>
  requestQuota(message?: string): Promise<void>
  deleteRequest(address: string): Promise<void>
}

export class BankService implements IBankService {

  protected readonly _vite: IViteClient
  protected readonly _emitter: IGlobalEmitter
  protected readonly _networkStore: INetworkStore
  private readonly _walletManager: WalletManager

  constructor(vite: IViteClient, emitter: IGlobalEmitter, networkStore: INetworkStore, walletManager: WalletManager) {
    this._vite = vite
    this._emitter = emitter
    this._networkStore = networkStore
    this._walletManager = walletManager
  }

  get account(): Maybe<Account> {
    return this._walletManager.getActiveAccount()
  }

  protected ensureAccountExists(reject: (reason?: any) => void): void {
    if (this.account?.address === undefined) {
      reject("Login and try again.")
    }
  }

  private removeAddressListener(): void {

  }

  init(contractAddress: string): void {
    this.removeAddressListener()
    // TODO: listen for vmlogs emitted by the specified contract
    // -> emit with GlobalEmitter
  }

  dispose(): void {
    this.removeAddressListener()
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

  async deleteRequest(address: string): Promise<void> {
    return Promise.resolve()
  }
}