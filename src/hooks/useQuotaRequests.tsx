import { useEffect, useState } from 'react'
import { IConnectedWeb3Context } from '.'
import { QuotaRequest } from '../types'

export const useQuotaRequests = (context: IConnectedWeb3Context) => {
  const initialValue: QuotaRequest[] = []
  const [quotaRequests, setQuotaRequests] = useState(initialValue)

  const fetchQuotaRequests = async (force: boolean = false) => {
    try {
      console.log('fetchQuotaRequests')
      // TODO: apply pagination
      const addresses = await context.vite.getQuotaRequests()
      const tempQuotaRequests: QuotaRequest[] = []
      // TODO: replace loop once supported by smart contracts
      // For now the getter function can only return primitive types. Structs and arrays are not allowed.
      for (let index = 0; index < addresses.length; index++) {
        const address = addresses[index];
        const quotaRequestResult = await context.vite.getQuotaRequestByAddress(address)
        tempQuotaRequests.push(quotaRequestResult)
      }
      setQuotaRequests(tempQuotaRequests)
    } catch (error) {
      setQuotaRequests(initialValue)
    }
  }

  useEffect(() => {
    console.log('useQuotaRequests')
    fetchQuotaRequests(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context])

  return {
    quotaRequests,
    fetchQuotaRequests
  }
}