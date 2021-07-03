import { IViteClient } from '../clients';
import { QuotaRequest } from '../types';

export interface IBankService {
  getQuotaRequests(): Promise<string[]>
  getQuotaRequestByAddress(address: string): Promise<QuotaRequest>
  requestQuota(message?: string): Promise<void>
}

export class BankService implements IBankService {

  protected readonly _vite: IViteClient

  constructor(vite: IViteClient) {
    this._vite = vite
  }

  async getQuotaRequests(): Promise<string[]> {
    return Promise.resolve([])
  }

  async getQuotaRequestByAddress(address: string): Promise<QuotaRequest> {
    return Promise.reject(`Quota request for '${address}' not found.`)
  }

  async requestQuota(message?: string): Promise<void> {
    return Promise.resolve()
  }
}