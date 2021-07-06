import { IViteClient } from '../clients';
import { AppConstants } from '../constants';
import { IGlobalEmitter } from '../emitters/globalEmitter';
import { INetworkStore } from '../stores';
import { Contract, QuotaRequest } from '../types';
import { fileUtil } from '../util/fileUtil';
import { Account, WalletManager } from '../wallet';

export interface IBankService {
  readonly listener: void
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
  private _offchainMethods: Map<string, string> = new Map<string, string>()
  private _listener: any

  constructor(vite: IViteClient, emitter: IGlobalEmitter, networkStore: INetworkStore, walletManager: WalletManager) {
    this._vite = vite
    this._emitter = emitter
    this._networkStore = networkStore
    this._walletManager = walletManager
  }

  get listener(): any {
    if (!this._listener) {
      throw new Error("Listener is not defined.")
    }
    return this._listener
  }

  private ensureContractExists(): Contract {
    if (this._contract?.address === undefined) {
      throw new Error("Bank contract is not defined.")
    } else {
      return this._contract
    }
  }

  protected ensureAccountExists(): Account {
    const account = this._walletManager.getActiveAccount()
    if (account?.address === undefined) {
      throw new Error("Login and try again.")
    } else {
      return account
    }
  }

  private removeAddressListener(): void {
    if (this._listener) {
      this._vite.removeListener(this._listener)
    }
  }

  async initAsync(): Promise<void> {
    this.removeAddressListener()
    const contract = await fileUtil.getInstance().readFileAsync('./assets/contracts/QuotaBank.json')
    this._contract = new Contract(JSON.parse(contract))
    this._contract.address = AppConstants.BankContractAddress
    console.log('Contract name:', this._contract?.contractName)
    // TODO: listen for vmlogs emitted by the specified contract
    // -> emit with GlobalEmitter
    this._listener = await this._vite.createAddressListenerAsync(this._contract.address)
    this._listener.on((results: any[]) => {
      if (!this._contract?.abi) {
        console.log('Could not decode vmlog because contract abi is not defined.')
      } else {
        for (let index = 0; index < results.length; index++) {
          const result = results[index];
          const vmLog = this._vite.decodeVmLog(result.vmlog, this._contract.abi);
          console.log(vmLog ?? result)
        }
      }
    });
  }

  dispose(): void {
    console.log("Disposing BankService")
    this.removeAddressListener()
  }

  async getOwnerAsync(): Promise<string> {
    const contract = this.ensureContractExists()
    const result = await this._vite.callOffChainMethodAsync(contract.address, this.getOffchainMethodAbi('getOwner'), contract.offChain, [])
    return result[0].value;
  }

  async getRequests(): Promise<string[]> {
    const contract = this.ensureContractExists()
    const result = await this._vite.callOffChainMethodAsync(contract.address, this.getOffchainMethodAbi('getRequestors'), contract.offChain, [])
    return result[0].value;
  }

  async getRequestByAddress(address: string): Promise<QuotaRequest> {
    const contract = this.ensureContractExists()
    const result = await this._vite.callOffChainMethodAsync(contract.address, this.getOffchainMethodAbi('getRequest'), contract.offChain, [address])
    const request = new QuotaRequest(this.objectFromEntries(result))
    request.address = address
    request.update(this._networkStore.blockHeight)
    return request;
  }

  async createRequest(message?: string): Promise<void> {
    const contract = this.ensureContractExists()
    const account = this.ensureAccountExists()
    const result = await this._vite.callContractAsync(account, 'RequestQuota', contract.abi, [message], AppConstants.DefaultZeroString, contract.address)
    console.log(result)
  }

  async stakeRequest(address: string, amount: number, duration: number): Promise<void> {
    return Promise.resolve()
  }

  async withdrawRequest(address: string): Promise<void> {
    return Promise.resolve()
  }

  async deleteRequest(address: string): Promise<void> {
    const contract = this.ensureContractExists()
    const account = this.ensureAccountExists()
    const result = await this._vite.callContractAsync(account, 'DeleteRequest', contract.abi, [address], AppConstants.DefaultZeroString, contract.address)
    console.log(result)
  }

  private getOffchainMethodAbi(name: string): string {
    const contract = this.ensureContractExists()
    let result: Maybe<string>
    if (this._offchainMethods.has(name)) {
      result = this._offchainMethods.get(name)
    } else {
      result = contract.abi.find(e => e.type === "offchain" && e.name === name)
      if (result) {
        this._offchainMethods.set(name, result)
      }
    }
    if (result) {
      return result
    } else {
      throw new Error(`The offchain method '${name}' does not exist.'`)
    }
  }

  private objectFromEntries = (entries: any) => {
    return Object.fromEntries(
      entries.map((entry: any) => {
        return [entry.name, entry.value];
      })
    );
  };
}