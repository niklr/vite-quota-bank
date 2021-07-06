import { wallet } from '@vite/vitejs';
import { Account, Wallet } from '.';
import { WalletStore } from './store';

export class WalletManager {

  private readonly _store: WalletStore;
  private _wallet?: Wallet;
  private _mnemonicDeriveIndex = 0;

  constructor() {
    this._store = new WalletStore();
    this.initWallet();
  }

  private initWallet(): void {
    const wallet = this._store.getItem();
    if (wallet) {
      this._wallet = wallet;
      this._mnemonicDeriveIndex = wallet.accounts.length;
    }
  }

  getWallet(): Maybe<Wallet> {
    return this._wallet;
  }

  createWallet(mnemonic: string): Maybe<Wallet> {
    this.removeWallet();
    if (this.validateMnemonic(mnemonic)) {
      const account = this.createAccount(mnemonic, 0);
      this._wallet = new Wallet({
        active: account,
        mnemonic,
        accounts: [
          account
        ]
      });
      this._store.setItem(this._wallet);
    }
    return this._wallet;
  }

  removeWallet(): void {
    this._wallet = undefined;
    this._mnemonicDeriveIndex = 0;
    this._store.clear();
  }

  getAccountByAddress(address: string): Maybe<Account> {
    return this._wallet?.accounts?.find(e => e.address === address)
  }

  addAccount(): Maybe<Account> {
    if (this._wallet?.mnemonic) {
      const account = this.createAccount(this._wallet.mnemonic);
      this._wallet.accounts.push(account);
      this.setActiveAccount(account);
      return account;
    }
    return undefined
  }

  getActiveAccount(): Maybe<Account> {
    return this._wallet?.active
  }

  setActiveAccount(account: Account): boolean {
    if (this._wallet) {
      this._wallet.active = account;
      this._store.setItem(this._wallet);
      return true;
    }
    return false;
  }

  getAccounts(): Account[] {
    if (this._wallet) {
      return this._wallet.accounts;
    }
    return [];
  }

  private createAccount(mnemonic: string, index = this._mnemonicDeriveIndex): Account {
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

  private validateMnemonic(mnemonic: Maybe<string>): Boolean {
    if (mnemonic) {
      return wallet.validateMnemonics(mnemonic);
    }
    return false;
  }
}