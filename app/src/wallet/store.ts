import { SessionWallet, Wallet, WebWallet } from '.';
import { AppConstants } from '../constants';
import { WalletType } from './types';

export class WalletStore {

  private readonly _webWalletKey = AppConstants.WebWalletStorageSpace;
  private readonly _sessionWalletKey = AppConstants.SessionWalletStorageSpace

  clear(): void {
    localStorage.removeItem(this._webWalletKey);
    sessionStorage.removeItem(this._sessionWalletKey);
  }

  getItem(): Maybe<WebWallet | SessionWallet> {
    let data;

    try {
      data = localStorage.getItem(this._webWalletKey);
      if (!data) {
        data = sessionStorage.getItem(this._sessionWalletKey);
      }
    } catch (err) {
      console.error(err);
      return undefined;
    }

    if (!data) {
      return undefined;
    }

    try {
      return Wallet.fromJS(JSON.parse(data));
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  setItem(data: WebWallet | SessionWallet): void {
    const saveData = JSON.stringify(data);

    try {
      switch (data.type) {
        case WalletType.Web:
          localStorage.setItem(this._webWalletKey, saveData);
          break;
        case WalletType.Session:
          sessionStorage.setItem(this._sessionWalletKey, saveData);
          break;
        default:
          throw new Error(`Wallet type '${data.type}' is not supported.`)
      }
    } catch (err) {
      console.error(err);
    }
  }
}