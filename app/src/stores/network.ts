import { AppConstants } from '../constants';
import { IGlobalEmitter } from '../emitters';
import { Network } from '../types';

export interface INetworkStore {
  blockHeight: string
  network: Network
  defaultNetwork: Network
  networks: Network[]
  getById(networkId: number): Maybe<Network>
  clear(): void
}

export class NetworkStore implements INetworkStore {

  private readonly _key: string = AppConstants.NetworkStorageSpace;
  private _emitter?: IGlobalEmitter
  private _blockHeight: string
  private _network?: Network
  private _defaultNetwork: Network
  private _networks: Network[] = [
    // new Network({
    //   id: 1,
    //   networkId: 1,
    //   name: 'MAINNET',
    //   rpcUrl: 'wss://node.vite.net/gvite/ws',
    //   connectorUrl: 'wss://biforst.vite.net
    // }),
    new Network({
      id: 2,
      networkId: 2,
      name: 'TESTNET',
      rpcUrl: 'wss://buidl.vite.net/gvite/ws', // https://buidl.vite.net/gvite
      connectorUrl: 'wss://biforst.vite.net'
    }),
    new Network({
      id: 3,
      networkId: 2,
      name: 'TESTNET+MOCK',
      rpcUrl: 'wss://buidl.vite.net/gvite/ws',
      connectorUrl: 'wss://biforst.vite.net',
      mock: true
    }),
    new Network({
      id: 4,
      networkId: 5,
      name: 'DEBUG',
      rpcUrl: 'ws://localhost:23457',
      connectorUrl: 'wss://biforst.vite.net'
    })
  ]

  constructor(emitter?: IGlobalEmitter) {
    this._emitter = emitter
    this._blockHeight = AppConstants.InitialNetworkBlockHeight
    this._defaultNetwork = this._networks[1]
  }

  get blockHeight(): string {
    return this._blockHeight
  }

  set blockHeight(height: string) {
    this._blockHeight = height
    this._emitter?.emitNetworkBlockHeight(height)
  }

  get network(): Network {
    if (this._network) {
      return this._network
    }

    let data;

    try {
      data = localStorage.getItem(this._key);
    } catch (err) {
      console.error(err);
    }

    if (!data) {
      return this.defaultNetwork;
    }

    try {
      const parsedNetwork = new Network(JSON.parse(data))
      this._network = this._networks.find(e => e.id === parsedNetwork.id)
      return this._network ?? this.defaultNetwork;
    } catch (err) {
      console.log(err);
      return this.defaultNetwork;
    }
  }

  set network(value: Network) {
    if (value) {
      this._network = value
      localStorage.setItem(this._key, JSON.stringify(value))
    } else {
      this._network = undefined
      localStorage.removeItem(this._key)
    }
  }

  get defaultNetwork(): Network {
    return this._defaultNetwork
  }

  get networks(): Network[] {
    return this._networks ?? []
  }

  getById(networkId: number): Maybe<Network> {
    return this._networks.find(e => e.id === networkId)
  }

  clear(): void {
    this._network = undefined
    localStorage.removeItem(this._key)
  }
}