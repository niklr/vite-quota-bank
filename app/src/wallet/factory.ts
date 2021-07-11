import { IWalletConnector, WalletConnector, WalletManager } from '.';
import { Network } from '../types';

export class WalletConnectorFactory {
  private readonly _walletManager: WalletManager

  constructor(walletManager: WalletManager) {
    this._walletManager = walletManager
  }

  create(network: Network): IWalletConnector {
    const session = this._walletManager.getValidSession()
    const account = this._walletManager.getActiveAccount()
    const opts = {
      bridge: network.connectorUrl,
      session
    }
    const meta = account ? { lastAccount: account.address } : undefined
    const connector = new WalletConnector(this._walletManager, opts, meta)

    if (!session) {
      connector.createSession().then(() => console.log('IWalletConnector connected', connector.uri))
    }

    return connector
  }
}