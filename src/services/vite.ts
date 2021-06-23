import { ViteAPI, wallet } from '@vite/vitejs';
import { Account } from '../wallet/account';
const { WS_RPC } = require('@vite/vitejs-ws');

const providerTimeout = 60000;
const providerOptions = { retryTimes: 10, retryInterval: 5000 };

export class ViteService {

  private provider: any;
  private client: any;
  private mnemonicsDeriveIndex = 0;

  initAsync = async (url: string) => new Promise<void>((resolve, reject) => {
    if (this.provider) {
      this.provider.destroy();
    }
    this.provider = new WS_RPC(url, providerTimeout, providerOptions);
    let isResolved = false;
    this.provider.on('error', (err: any) => {
      console.log(err);
      if (isResolved) return;
      reject(err);
    });
    this.client = new ViteAPI(this.provider, () => {
      console.log(`ViteAPI connected to ${this.provider.path}`);
      isResolved = true;
      resolve();
    });
  });

  createAccount(mnemonics: string, index = this.mnemonicsDeriveIndex): Account {
    const { privateKey } = wallet.deriveAddress({
      mnemonics,
      index
    });
    let account = new Account({
      id: index.toString(),
      privateKey,
      address: wallet.createAddressByPrivateKey(privateKey).address
    });
    this.mnemonicsDeriveIndex = index + 1;
    return account;
  }
}