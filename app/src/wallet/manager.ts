import { wallet } from '@vite/vitejs';
import { SessionWallet, WalletAccount, WebWallet, WebWalletAccount } from '.';
import { WalletStore } from './store';

export class WalletManager {

  private readonly _store: WalletStore;
  private _wallet?: WebWallet | SessionWallet;
  private _mnemonicDeriveIndex = 0;
  private _setWalletCallback?: (wallet?: WebWallet | SessionWallet | undefined) => void;

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

  set onSetWalletCallback(cb: (wallet?: WebWallet | SessionWallet | undefined) => void) {
    this._setWalletCallback = cb;
  }

  getWallet(): Maybe<WebWallet | SessionWallet> {
    return this._wallet;
  }

  setWallet(wallet?: WebWallet | SessionWallet): void {
    this._wallet = wallet;
    this.updateWallet()
  }

  updateWallet(): void {
    if (this._setWalletCallback) {
      this._setWalletCallback(this._wallet);
    }
  }

  createWebWallet(mnemonic: string): Maybe<WebWallet> {
    if (!this.validateMnemonic(mnemonic)) {
      return undefined;
    }
    this.resetWallet();
    const account = this.createWebWalletAccount(mnemonic, 0);
    const wallet = new WebWallet({
      active: account,
      mnemonic,
      accounts: [
        account
      ]
    });
    this._store.setItem(wallet);
    this.setWallet(wallet);
    return wallet;
  }

  removeWallet(): void {
    this.resetWallet();
    this.updateWallet();
  }

  getAccountByAddress(address: string): Maybe<WalletAccount> {
    return this._wallet?.accounts?.find(e => e.address === address)
  }

  addAccount(): Maybe<WalletAccount> {
    if (this._wallet instanceof WebWallet) {
      const account = this.createWebWalletAccount(this._wallet.mnemonic);
      this._wallet.accounts.push(account);
      this.setActiveAccount(account);
      return account;
    }
    return undefined
  }

  getActiveAccount(): Maybe<WalletAccount> {
    return this._wallet?.active
  }

  setActiveAccount(account: WalletAccount): boolean {
    if (this._wallet) {
      this._wallet.active = account;
      this._store.setItem(this._wallet);
      this.updateWallet();
      return true;
    }
    return false;
  }

  getAccounts(): WalletAccount[] {
    if (this._wallet) {
      return this._wallet.accounts;
    }
    return [];
  }

  private resetWallet(): void {
    this._wallet = undefined;
    this._mnemonicDeriveIndex = 0;
    this._store.clear();
  }

  private createWebWalletAccount(mnemonic: string, index = this._mnemonicDeriveIndex): WebWalletAccount {
    const { privateKey } = wallet.deriveAddress({
      mnemonics: mnemonic,
      index
    });
    let account = new WebWalletAccount({
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