import { ViteAPI } from '@vite/vitejs';
const { WS_RPC } = require('@vite/vitejs-ws');

const providerTimeout = 60000;
const providerOptions = { retryTimes: 10, retryInterval: 5000 };

export class ViteService {

  private provider: any;
  private client: any;

  initAsync = async (url: string) => new Promise<void>((resolve, reject) => {
    if (this.provider) {
      this.provider.destroy();
    }
    this.provider = new WS_RPC(url, providerTimeout, providerOptions);
    let rejectedTimes = 0;
    this.provider.on('error', (err: any) => {
      console.log(err);
      if (rejectedTimes > 0) return;
      reject(err);
      rejectedTimes++;
    });
    this.client = new ViteAPI(this.provider, () => {
      console.log(`ViteAPI connected to ${this.provider.path}`);
      resolve();
    });
  });
}