import { ViteAPI, wallet } from '@vite/vitejs';
import { Account } from '../wallet/account';
const { WS_RPC } = require('@vite/vitejs-ws');

const providerTimeout = 60000;
const providerOptions = { retryTimes: 10, retryInterval: 5000 };

export class ViteService {

  private _provider: any;
  private _client: any;
  private _mnemonicsDeriveIndex = 0;
  private _isReady = false;

  get isReady(): boolean {
    return this._isReady;
  }

  initAsync = async (url: string) => new Promise<void>((resolve, reject) => {
    this._isReady = false;
    if (this._provider) {
      this._provider.destroy();
    }
    this._provider = new WS_RPC(url, providerTimeout, providerOptions);
    let isResolved = false;
    this._provider.on('error', (err: any) => {
      console.log(err);
      if (isResolved) return;
      reject(err);
    });
    this._client = new ViteAPI(this._provider, () => {
      this._isReady = true;
      console.log(`ViteAPI connected to ${this._provider.path}`);
      isResolved = true;
      resolve();
    });
  });

  createAccount(mnemonics: string, index = this._mnemonicsDeriveIndex): Account {
    const { privateKey } = wallet.deriveAddress({
      mnemonics,
      index
    });
    let account = new Account({
      id: index.toString(),
      privateKey,
      address: wallet.createAddressByPrivateKey(privateKey).address
    });
    this._mnemonicsDeriveIndex = index + 1;
    return account;
  }

  validateMnemonics(mnemonics: Maybe<string>): Boolean {
    if (mnemonics) {
      return wallet.validateMnemonics(mnemonics);
    }
    return false;
  }

  async getSnapshotChainHeightAsync(): Promise<number> {
    return this._client.request('ledger_getSnapshotChainHeight');
  }
}