import { IViteClient } from '../clients';
import { AppConstants } from '../constants';
import { IGlobalEmitter } from '../emitters/globalEmitter';
import { INetworkStore } from '../stores';
import { Contract, QuotaRequest } from '../types';
import { fileUtil } from '../util/fileUtil';
import { Account, WalletManager } from '../wallet';

export interface IBankService {
  initAsync(): Promise<void>
  dispose(): void
  getOwnerAsync(): Promise<string>
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
  private _contract?: Contract

  constructor(vite: IViteClient, emitter: IGlobalEmitter, networkStore: INetworkStore, walletManager: WalletManager) {
    this._vite = vite
    this._emitter = emitter
    this._networkStore = networkStore
    this._walletManager = walletManager
  }

  get account(): Maybe<Account> {
    return this._walletManager.getActiveAccount()
  }

  private ensureContractExists(): Contract {
    if (this._contract?.address === undefined) {
      throw new Error("Bank contract is not defined.")
    } else {
      return this._contract
    }
  }

  protected ensureAccountExists(reject: (reason?: any) => void): boolean {
    if (this.account?.address === undefined) {
      reject("Login and try again.")
      return false
    }
    return true
  }

  private removeAddressListener(): void {

  }

  async initAsync(): Promise<void> {
    this.removeAddressListener()
    const contract = await fileUtil.getInstance().readFileAsync('./assets/contracts/quota_bank.json')
    this._contract = new Contract(JSON.parse(contract))
    this._contract.address = AppConstants.QuotaContractAddress
    console.log('Contract name:', this._contract?.contractName)
    // TODO: listen for vmlogs emitted by the specified contract
    // -> emit with GlobalEmitter
  }

  dispose(): void {
    this.removeAddressListener()
  }

  async getOwnerAsync(): Promise<string> {
    const contract = this.ensureContractExists()
    const result = await this._vite.callOffChainMethodAsync(contract.address, contract.abi, contract.offChain, [])
    return result[0].value;
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