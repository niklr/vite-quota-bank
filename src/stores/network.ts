import { Network } from '../common/networks'

export interface INetworkStore {
  network?: Network
  blockHeight: string
}

export class NetworkStore implements INetworkStore {
  network?: Network
  blockHeight: string

  constructor() {
    this.blockHeight = "0"
  }
}