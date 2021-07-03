import { IViteClient, ViteClient, ViteMockClient } from '../clients';
import { BankMockService, BankService, IBankService } from '../services';
import { WalletManager } from '../wallet';

export class ServiceProvider {
  vite: IViteClient
  bank: IBankService

  constructor(walletManager: WalletManager) {
    if (process.env.REACT_APP_USE_MOCK) {
      this.vite = new ViteMockClient()
      this.bank = new BankMockService(this.vite, walletManager)
    } else {
      this.vite = new ViteClient()
      this.bank = new BankService(this.vite, walletManager)
    }
  }
}