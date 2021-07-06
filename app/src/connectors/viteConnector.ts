import { AbstractConnector } from './abstractConnector'
import { ConnectorUpdate } from './types'

interface ViteConnectorArguments {
  chainId: number
  config?: any
}

export class ViteConnector extends AbstractConnector {
  private readonly chainId: number
  private readonly config: any

  public vite: any

  constructor({ chainId, config = {} }: ViteConnectorArguments) {
    super({ supportedChainIds: [chainId] })

    this.chainId = chainId
    this.config = config
  }

  public async activate(): Promise<ConnectorUpdate> {
    if (!this.vite) {
      this.vite = {}
    }

    await this.vite
      .getProvider()
      .enable()
      .then((accounts: string[]): string => accounts[0])

    return { provider: this.vite.getProvider() }
  }

  public async getProvider(): Promise<any> {
    return this.vite.getProvider()
  }

  public async getChainId(): Promise<number | string> {
    return this.vite.getNetworkId()
  }

  public async getAccount(): Promise<null | string> {
    return this.vite.getAccountAddress()
  }

  public deactivate() { }

  public async close() {
    this.vite.logout()
    this.emitDeactivate()
  }
}