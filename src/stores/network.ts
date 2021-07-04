import { Network } from '../common/networks'
import { AppConstants } from '../constants'
import { IGlobalEmitter } from '../emitters/globalEmitter'

export interface INetworkStore {
  network?: Network
  blockHeight: string
}

export class NetworkStore implements INetworkStore {

  private _emitter: IGlobalEmitter
  private _blockHeight: string
  network?: Network

  constructor(emitter: IGlobalEmitter) {
    this._emitter = emitter
    this._blockHeight = AppConstants.InitialNetworkBlockHeight
  }

  get blockHeight(): string {
    return this._blockHeight
  }

  set blockHeight(height: string) {
    this._blockHeight = height
    this._emitter.emitNetworkBlockHeight(height)
  }
}