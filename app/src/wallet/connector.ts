import Connector from '@vite/connector';
import { WalletStore } from '.';
import { SessionWallet } from './types';

export class WalletConnector extends Connector {
  private readonly _store: WalletStore;
  constructor(opts: any, meta: any) {
    super(opts, meta);
    this._store = new WalletStore();
    this.on("connect", (err: any, payload: any) => {
      console.log('WalletConnector.connect', payload)
      const { accounts } = payload.params[0];
      this.setAccState(accounts);
    });
    this.on('disconnect', () => {
      console.log('WalletConnector.disconnect')
    });
    this.on('session_update', () => {
      console.log('WalletConnector.session_update')
    });
  }

  setAccState(accounts = []) {
    if (!accounts || !accounts[0]) throw new Error('address is null');
    // setCurrHDAcc({
    //   activeAddr: accounts[0],
    //   isBifrost: true,
    //   isSeparateKey: true
    // });
    // getCurrHDAcc().unlock(this);
    // store.commit('switchHDAcc', {
    //   activeAddr: accounts[0],
    //   isBifrost: true,
    //   isSeparateKey: true
    // });
    // store.commit('setCurrHDAccStatus');
    this.saveSession();
  }

  saveSession() {
    const wallet = new SessionWallet({
      session: this.session,
      timestamp: new Date().getTime()
    })
    this._store.setItem(wallet);
  }

  async createSession() {
    await super.createSession();
    return this.uri;
  }

  async sendVbTx(...args: any) {
    return new Promise((res, rej) => {
      this.on('disconnect', () => {
        rej({ code: 11020, message: '链接断开' });
      });

      this.sendCustomRequest({ method: 'vite_signAndSendTx', params: args }).then((r: any) => {
        this.saveSession();
        res(r);
      }).catch((e: any) => {
        rej(e);
      });
    });
  }

  async signVbText(...args: any) {
    return new Promise((res, rej) => {
      this.on('disconnect', () => {
        rej({ code: 11020, message: '链接断开' });
      });

      this.sendCustomRequest({ method: 'vite_signMessage', params: args }).then((r: any) => {
        this.saveSession();
        res(r);
      }).catch((e: any) => {
        rej(e);
      });
    });
  }
}