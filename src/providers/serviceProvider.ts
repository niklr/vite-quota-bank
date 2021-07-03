import { IViteClient, ViteClient, ViteMockClient } from '../clients';
import { BankMockService, BankService, IBankService } from '../services';
import { INetworkStore, NetworkStore } from '../stores';
import { WalletManager } from '../wallet';

export class ServiceProvider {
  networkStore: INetworkStore
  vite: IViteClient
  bank: IBankService

  constructor(walletManager: WalletManager) {
    this.networkStore = new NetworkStore()
    if (process.env.REACT_APP_USE_MOCK) {
      this.vite = new ViteMockClient()
      this.bank = new BankMockService(this.vite, this.networkStore, walletManager)
    } else {
      this.vite = new ViteClient()
      this.bank = new BankService(this.vite, this.networkStore, walletManager)
    }
  }
}