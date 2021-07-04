import { AppConstants } from '../constants';
import { IGlobalEmitter } from '../emitters/globalEmitter';
import { Network } from '../types';

export interface INetworkStore {
  blockHeight: string
  network?: Network
  networks: Network[]
  getById(networkId: number): Maybe<Network>
}

export class NetworkStore implements INetworkStore {

  private readonly _key: string = AppConstants.WebWalletStorageSpace;
  private _emitter?: IGlobalEmitter
  private _blockHeight: string
  private _network?: Network
  private _networks: Network[] = [
    new Network({
      id: 1,
      name: 'MAINNET',
      url: 'wss://node.vite.net/gvite/ws'
    }),
    new Network({
      id: 2,
      name: 'TESTNET',
      url: 'wss://buidl.vite.net/gvite/ws' // https://buidl.vite.net/gvite
    }),
    new Network({
      id: 5,
      name: 'DEBUG',
      url: 'ws://localhost:23457'
    })
  ]

  constructor(emitter?: IGlobalEmitter) {
    this._emitter = emitter
    this._blockHeight = AppConstants.InitialNetworkBlockHeight
  }

  get blockHeight(): string {
    return this._blockHeight
  }

  set blockHeight(height: string) {
    this._blockHeight = height
    this._emitter?.emitNetworkBlockHeight(height)
  }

  get network(): Maybe<Network> {
    if (this._network) {
      return this._network
    }

    let data;

    try {
      data = localStorage.getItem(this._key);
    } catch (err) {
      console.error(err);
      return undefined;
    }

    if (!data) {
      return undefined;
    }

    try {
      this._network = new Network(JSON.parse(data))
      return this._network;
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  set network(value: Maybe<Network>) {
    if (value) {
      this._network = value
      localStorage.setItem(this._key, JSON.stringify(value))
    } else {
      this._network = undefined
      localStorage.removeItem(this._key)
    }
  }

  get networks(): Network[] {
    return this._networks ?? []
  }

  getById(networkId: number): Maybe<Network> {
    return this._networks.find(e => e.id === networkId)
  }
}