import { QuotaRequest } from '../types';
import { BankService } from './bank';

const quotaRequests = [
  new QuotaRequest({
    address: 'vite_48e7436290e300268ed360a28704d9df9dbcbe485f7ed24cf1',
    expirationHeight: '1487686'
  }),
  new QuotaRequest({
    address: 'vite_7fb28c2b8c3ee3fd5d271f632b16ef81f1f98d136445a1c1cb',
    expirationHeight: '1350996',
    message: 'Twitter: 0xRomanNiklaus'
  }),
  new QuotaRequest({
    address: 'vite_ce9499905e2dacab4972574cc4319f9b9d44020af89a239463',
    expirationHeight: '1587687',
    message: 'GitHub: niklr',
    amount: '1500000000000000000000'
  }),
  new QuotaRequest({
    address: 'vite_df81e81a5e552f54fccdad71aa0b951ebec6e456f9d0c69ee4',
    expirationHeight: '1350998',
    amount: '1500000000000000000000'
  }),
  new QuotaRequest({
    message: 'Test 1324'
  })
]

export class BankMockService extends BankService {
  async getQuotaRequests(): Promise<string[]> {
    return Promise.resolve(quotaRequests.flatMap(e => e.address ? e.address : []))
  }

  async getQuotaRequestByAddress(address: string): Promise<QuotaRequest> {
    const result = quotaRequests.find(e => e.address === address);
    if (result) {
      return Promise.resolve(result)
    }
    return Promise.reject(`Quota request for '${address}' not found.`)
  }
}