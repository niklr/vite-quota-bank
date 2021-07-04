import EventEmitter from 'events';
import { GlobalEvent } from './types';

export interface IGlobalEmitter {
  emitNetworkBlockHeight(height: string): void
  on(event: string | symbol, listener: (...args: any[]) => void): this
  off(event: string | symbol, listener: (...args: any[]) => void): this
}

export class GlobalEmitter extends EventEmitter implements IGlobalEmitter {
  emitNetworkBlockHeight(height: string): void {
    this.emit(GlobalEvent.NetworkBlockHeight, height)
  }
}