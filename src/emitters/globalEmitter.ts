import EventEmitter from 'events';
import { QuotaRequest } from '../types';
import { GlobalEvent } from './types';

export interface IGlobalEmitter {
  emitNetworkBlockHeight(height: string): void
  emitQuotaRequestUpdate(update: QuotaRequest): void
  on(event: string | symbol, listener: (...args: any[]) => void): this
  off(event: string | symbol, listener: (...args: any[]) => void): this
}

export class GlobalEmitter extends EventEmitter implements IGlobalEmitter {
  emitNetworkBlockHeight(height: string): void {
    this.emit(GlobalEvent.NetworkBlockHeight, height)
  }
  emitQuotaRequestUpdate(update: QuotaRequest): void {
    this.emit(GlobalEvent.QuotaRequestUpdate, update)
  }
}