import { ViteAPI } from '@vite/vitejs';
import { Quota } from '../types';
const { WS_RPC } = require('@vite/vitejs-ws');

const providerTimeout = 60000;
const providerOptions = { retryTimes: 10, retryInterval: 5000 };

export class ViteService {

  private _provider: any;
  private _client: any;
  private _isConnected = false;

  get isConnected(): boolean {
    return this._isConnected;
  }

  private async requestAsync(method: string, params?: any): Promise<any> {
    if (this._isConnected) {
      return this._client.request(method, params);
    } else {
      return Promise.reject('Vite client is not ready to make requests.');
    }
  }

  initAsync = async (url: string) => new Promise<void>((resolve, reject) => {
    this._isConnected = false;
    if (this._provider) {
      this._provider.destroy();
    }
    this._provider = new WS_RPC(url, providerTimeout, providerOptions);
    let isResolved = false;
    this._provider.on('error', (err: any) => {
      console.log(err);
      if (isResolved) return;
      reject(err);
      this._isConnected = false;
    });
    this._client = new ViteAPI(this._provider, () => {
      this._isConnected = true;
      console.log(`ViteAPI connected to ${this._provider.path}`);
      isResolved = true;
      resolve();
    });
  });

  disconnect(): void {
    this._provider.disconnect();
    this._isConnected = false;
  }

  async getSnapshotChainHeightAsync(): Promise<number> {
    return this.requestAsync('ledger_getSnapshotChainHeight');
  }

  async getQuotaByAccount(address: string): Promise<Quota> {
    const result = await this.requestAsync("contract_getQuotaByAccount", address);
    return new Quota(result);
  }
}