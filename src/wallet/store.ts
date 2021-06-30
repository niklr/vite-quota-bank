import { Account, WalletConstants } from '.';

export class WalletStore {
  getKey(name: string): string {
    return `${WalletConstants.WalletSpace}:${name}`;
  }

  getItem(key: string): any {
    let data;

    try {
      data = localStorage.getItem(this.getKey(key));
    } catch (err) {
      console.error(err);
      return null;
    }

    if (!data) {
      return null;
    }

    try {
      data = JSON.parse(data);
      return data;
    } catch (err) {
      return data;
    }
  }

  setItem(key: string, data: any): void {
    const saveData = typeof data === 'string' ? data : JSON.stringify(data);

    try {
      localStorage.setItem(this.getKey(key), saveData);
    } catch (err) {
      console.error(err);
    }
  }

  setLastAcc(acc: Account): void {
    if (!acc || !acc.id) {
      return;
    }
    this.setItem(WalletConstants.LastAccKey, acc.id);
  }
}