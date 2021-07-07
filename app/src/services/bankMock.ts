import { AppConstants } from '../constants';
import { QuotaRequest } from '../types';
import { bigNumber } from '../util/bigNumber';
import { BankService } from './bank';

const quotaRequests = [
  new QuotaRequest({
    address: 'vite_48e7436290e300268ed360a28704d9df9dbcbe485f7ed24cf1',
    expirationHeight: '1487686'
  }),
  new QuotaRequest({
    address: 'vite_7fb28c2b8c3ee3fd5d271f632b16ef81f1f98d136445a1c1cb',
    expirationHeight: '1987866',
    note: 'Twitter: 0xRomanNiklaus'
  }),
  new QuotaRequest({
    address: 'vite_ce9499905e2dacab4972574cc4319f9b9d44020af89a239463',
    expirationHeight: '1587687',
    note: 'GitHub: niklr',
    amount: '1500000000000000000000'
  }),
  new QuotaRequest({
    address: 'vite_df81e81a5e552f54fccdad71aa0b951ebec6e456f9d0c69ee4',
    expirationHeight: '1350998',
    amount: '1500000000000000000000'
  }),
  new QuotaRequest({
    note: 'Test 1324'
  })
]

export class BankMockService extends BankService {
  getRequests = async () => new Promise<string[]>((resolve, reject) => {
    setTimeout(() => {
      resolve(quotaRequests.flatMap(e => e.address ? e.address : []))
    }, 1000)
  })

  getRequestByAddress = async (address: string) => new Promise<QuotaRequest>((resolve, reject) => {
    const result = quotaRequests.find(e => e.address === address);
    result?.update(this._networkStore.blockHeight)
    if (result) {
      setTimeout(() => {
        resolve(result)
      }, 100)
    } else {
      reject(`Quota request for '${address}' not found.`)
    }
  })

  createRequest = async (note?: string) => new Promise<void>((resolve, reject) => {
    const account = this.ensureAccountExists()
    if (note) {
      if (account.address && quotaRequests.find(e => e.address === account.address)) {
        reject("Request already exists.")
      } else {
        const newItem = new QuotaRequest({
          address: account.address,
          note,
          expirationHeight: this._networkStore.blockHeight + 10
        })
        newItem.update(this._networkStore.blockHeight)
        quotaRequests.push(newItem)
        resolve()
        setTimeout(() => {
          this._emitter.emitQuotaRequestUpdated(newItem)
        }, 500)
      }
    } else {
      setTimeout(() => {
        reject("Request failed. Please try again later.")
      }, 2000)
    }
  })

  stakeRequest = async (address: string, amount: number, duration: number) => new Promise<void>((resolve, reject) => {
    this.ensureAccountExists()
    if (!amount || amount <= 0) {
      reject("Please provide a valid amount.")
      return
    }
    if (!duration || duration <= 0) {
      reject("Please provide a valid duration.")
      return
    }
    const existing = quotaRequests.find(e => e.address === address)
    if (!existing) {
      reject("Request does not exist.")
    } else {
      existing.amount = bigNumber.toMin(amount, AppConstants.DefaultDecimals)
      existing.expirationHeight = this._networkStore.blockHeight + duration
      const updatedItem = new QuotaRequest(existing)
      updatedItem.update(this._networkStore.blockHeight)
      resolve()
      setTimeout(() => {
        this._emitter.emitQuotaRequestUpdated(updatedItem)
      }, 500)
    }
  })

  withdrawRequest = async (address: string) => new Promise<void>((resolve, reject) => {
    this.ensureAccountExists()
    const existing = quotaRequests.find(e => e.address === address)
    if (!existing) {
      reject("Request does not exist.")
    } else {
      existing.amount = undefined
      const updatedItem = new QuotaRequest(existing)
      updatedItem.update(this._networkStore.blockHeight)
      resolve()
      setTimeout(() => {
        this._emitter.emitQuotaRequestUpdated(updatedItem)
      }, 500)
    }
  })

  deleteRequest = async (address: string) => new Promise<void>((resolve, reject) => {
    this.ensureAccountExists()
    const existing = quotaRequests.find(e => e.address === address)
    if (!existing) {
      reject("Request does not exist.")
    } else {
      const index = quotaRequests.indexOf(existing);
      if (index > -1) {
        quotaRequests.splice(index, 1);
      }
      setTimeout(() => {
        resolve()
        this._emitter.emitQuotaRequestDeleted(address)
      }, 500)
    }
  })
}