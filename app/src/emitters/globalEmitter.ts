import EventEmitter from 'events';
import { QuotaRequest } from '../types';
import { GlobalEvent } from './types';

export interface IGlobalEmitter {
  emitNetworkBlockHeight(height: string): void
  emitQuotaRequestUpdated(update: QuotaRequest): void
  emitQuotaRequestDeleted(address: string): void
  emitConfirmTransactionDialog(open: boolean): void
  on(event: string | symbol, listener: (...args: any[]) => void): this
  off(event: string | symbol, listener: (...args: any[]) => void): this
}

export class GlobalEmitter extends EventEmitter implements IGlobalEmitter {
  emitNetworkBlockHeight(height: string): void {
    this.emit(GlobalEvent.NetworkBlockHeight, height)
  }
  emitQuotaRequestUpdated(update: QuotaRequest): void {
    this.emit(GlobalEvent.QuotaRequestUpdated, update)
  }
  emitQuotaRequestDeleted(address: string): void {
    this.emit(GlobalEvent.QuotaRequestDeleted, address)
  }
  emitConfirmTransactionDialog(open: boolean): void {
    this.emit(GlobalEvent.ConfirmTransactionDialog, open)
  }
}