import { Wallet } from '.';
import { AppConstants } from '../constants';

export class WalletStore {

  private readonly _key = AppConstants.WebWalletStorageSpace;

  clear(): void {
    localStorage.removeItem(this._key);
  }

  getItem(): Maybe<Wallet> {
    let data;

    try {
      data = localStorage.getItem(this._key);
    } catch (err) {
      console.error(err);
      return undefined;
    }

    if (!data) {
      return undefined;
    }

    try {
      return new Wallet(JSON.parse(data));
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  setItem(data: Wallet): void {
    const saveData = typeof data === 'string' ? data : JSON.stringify(data);

    try {
      localStorage.setItem(this._key, saveData);
    } catch (err) {
      console.error(err);
    }
  }
}