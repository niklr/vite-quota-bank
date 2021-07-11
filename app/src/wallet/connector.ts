import Connector from '@vite/connector';
import { WalletManager } from '.';
import { SessionWallet, SessionWalletAccount } from './types';

export interface IWalletConnector {
  readonly uri: string
  sendTransactionAsync(...args: any): Promise<any>
  signMessageAsync(...args: any): Promise<any>
  killSessionAsync(): Promise<void>
  on(event: string | symbol, listener: (...args: any[]) => void): this
  off(event: string | symbol, listener: (...args: any[]) => void): this
}

export class WalletConnector extends Connector implements IWalletConnector {
  private readonly _walletManager: WalletManager;

  constructor(walletManager: WalletManager, opts: any, meta?: any) {
    super(opts, meta);
    this._walletManager = walletManager;
    this.on('connect', (err: any, payload: any) => {
      console.log('WalletConnector.connect', err, payload)
      const { accounts } = payload.params[0];
      this.saveSession(accounts);
    });
    this.on('disconnect', (err: any, payload: any) => {
      console.log('WalletConnector.disconnect', err, payload)
      this.stopBizHeartBeat()
    });
    this.on('session_update', (err: any, payload: any) => {
      console.log('WalletConnector.session_update', err, payload)
      const session = payload[0];
      if (session && session.accounts) {
        this.saveSession(session.accounts);
      }
    });
  }

  get uri(): string {
    return super.uri
  }

  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener)
  }

  off(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.off(event, listener)
  }

  saveSession(accounts: string[]): void {
    if (!accounts || !accounts[0]) {
      throw new Error('address is null');
    }
    const sessionAccounts: SessionWalletAccount[] = []
    for (let index = 0; index < accounts.length; index++) {
      const address = accounts[index];
      sessionAccounts.push(new SessionWalletAccount({
        id: index.toString(),
        address: address
      }))
    }
    const wallet = new SessionWallet({
      active: sessionAccounts[0],
      accounts: sessionAccounts,
      session: this.session,
      timestamp: new Date().getTime()
    })
    this._walletManager.setWallet(wallet)
  }

  updateSession(): void {
    const existing = this._walletManager.getWallet()
    if (existing && existing instanceof SessionWallet) {
      existing.timestamp = new Date().getTime()
      this._walletManager.updateWalletStore(existing)
    }
  }

  async createSession(): Promise<string> {
    await super.createSession();
    return this.uri;
  }

  async sendTransactionAsync(...args: any): Promise<any> {
    return new Promise((res, rej) => {
      this.on('disconnect', () => {
        rej("Request aborted due to disconnect.");
      });

      this.sendCustomRequest({ method: 'vite_signAndSendTx', params: args }).then((r: any) => {
        this.updateSession();
        res(r);
      }).catch((e: any) => {
        rej(e);
      });
    });
  }

  async signMessageAsync(...args: any): Promise<any> {
    return new Promise((res, rej) => {
      this.on('disconnect', () => {
        rej("Request aborted due to disconnect.");
      });

      this.sendCustomRequest({ method: 'vite_signMessage', params: args }).then((r: any) => {
        this.updateSession();
        res(r);
      }).catch((e: any) => {
        rej(e);
      });
    });
  }

  async killSessionAsync(): Promise<any> {
    await super.killSession();
  }
}