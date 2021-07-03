import { QuotaRequest } from '../types';

export interface IBankService {
  getQuotaRequests(): Promise<string[]>
  getQuotaRequestByAddress(address: string): Promise<QuotaRequest>
}

export class BankService implements IBankService {
  async getQuotaRequests(): Promise<string[]> {
    return Promise.resolve([])
  }

  async getQuotaRequestByAddress(address: string): Promise<QuotaRequest> {
    return Promise.reject(`Quota request for '${address}' not found.`)
  }
}