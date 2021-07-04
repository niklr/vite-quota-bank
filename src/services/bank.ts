import { IViteClient } from '../clients';
import { IGlobalEmitter } from '../emitters/globalEmitter';
import { INetworkStore } from '../stores';
import { QuotaRequest } from '../types';
import { Account, WalletManager } from '../wallet';

export interface IBankService {
  init(contractAddress: string): void
  dispose(): void
  getRequests(): Promise<string[]>
  getRequestByAddress(address: string): Promise<QuotaRequest>
  createRequest(message?: string): Promise<void>
  stakeRequest(address: string, amount: number, duration: number): Promise<void>
  withdrawRequest(address: string): Promise<void>
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

  async getRequests(): Promise<string[]> {
    return Promise.resolve([])
  }

  async getRequestByAddress(address: string): Promise<QuotaRequest> {
    return Promise.reject(`Quota request for '${address}' not found.`)
  }

  async createRequest(message?: string): Promise<void> {
    return Promise.resolve()
  }

  async stakeRequest(address: string, amount: number, duration: number): Promise<void> {
    return Promise.resolve()
  }

  async withdrawRequest(address: string): Promise<void> {
    return Promise.resolve()
  }

  async deleteRequest(address: string): Promise<void> {
    return Promise.resolve()
  }
}