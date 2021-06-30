import { wallet } from '@vite/vitejs';
import { Account, Wallet } from '.';
import { WalletStore } from './store';

export class WalletManager {

  private readonly _store: WalletStore;
  private _mnemonicDeriveIndex = 0;

  constructor() {
    this._store = new WalletStore();
  }

  getWallet(): Maybe<Wallet> {
    return this._store.getItem();
  }

  createWallet(mnemonic: string): Wallet {
    const account = this.createAccount(mnemonic, 0);
    const wallet = new Wallet({
      active: account,
      mnemonic,
      accounts: [
        account
      ]
    });
    this._store.setItem(wallet);
    return wallet;
  }

  removeWallet(): void {
    this._mnemonicDeriveIndex = 0;
    this._store.clear();
  }

  createAccount(mnemonic: string, index = this._mnemonicDeriveIndex): Account {
    const { privateKey } = wallet.deriveAddress({
      mnemonics: mnemonic,
      index
    });
    let account = new Account({
      id: index.toString(),
      privateKey,
      address: wallet.createAddressByPrivateKey(privateKey).address
    });
    this._mnemonicDeriveIndex = index + 1;
    return account;
  }

  validateMnemonic(mnemonic: Maybe<string>): Boolean {
    if (mnemonic) {
      return wallet.validateMnemonics(mnemonic);
    }
    return false;
  }
}