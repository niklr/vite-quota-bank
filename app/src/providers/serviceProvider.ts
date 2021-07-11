import { IViteClient, ViteClient, ViteMockClient } from '../clients';
import { GlobalEmitter, IGlobalEmitter } from '../emitters';
import { BankMockService, BankService, IBankService } from '../services';
import { INetworkStore, NetworkStore } from '../stores';
import { WalletConnectorFactory, WalletManager } from '../wallet';

export class ServiceProvider {
  emitter: IGlobalEmitter
  networkStore: INetworkStore
  vite: IViteClient
  bank: IBankService

  constructor(walletManager: WalletManager) {
    this.emitter = new GlobalEmitter()
    this.networkStore = new NetworkStore(this.emitter)
    const walletConnectorFactory = new WalletConnectorFactory(walletManager)
    if (this.networkStore.network.mock) {
      this.vite = new ViteMockClient(this.emitter, walletConnectorFactory)
      this.bank = new BankMockService(this.vite, this.emitter, this.networkStore, walletManager)
    } else {
      this.vite = new ViteClient(this.emitter, walletConnectorFactory)
      this.bank = new BankService(this.vite, this.emitter, this.networkStore, walletManager)
    }
  }

  dispose(): void {
    console.log("Disposing ServiceProvider")
    this.vite.dispose()
    this.bank.dispose()
  }
}