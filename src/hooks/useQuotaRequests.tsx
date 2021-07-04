import { useEffect, useState } from 'react'
import { IConnectedWeb3Context } from '.'
import { QuotaRequest } from '../types'

export const useQuotaRequests = (context: IConnectedWeb3Context) => {
  const initialValue: QuotaRequest[] = []
  const [isLoading, setIsLoading] = useState(false)
  const [quotaRequests, setQuotaRequests] = useState(initialValue)

  const fetchQuotaRequests = async (force: boolean = false) => {
    setIsLoading(true)
    console.log('fetchQuotaRequests')
    setQuotaRequests([])
    try {
      // TODO: apply pagination
      const addresses = await context.provider.bank.getRequests()
      const tempQuotaRequests: QuotaRequest[] = []
      // TODO: replace loop once supported by smart contracts
      // For now the getter function can only return primitive types. Structs and arrays are not allowed.
      for (let index = 0; index < addresses.length; index++) {
        const address = addresses[index];
        try {
          const quotaRequestResult = await context.provider.bank.getRequestByAddress(address)
          tempQuotaRequests.unshift(quotaRequestResult)
        } catch (error) {
          console.log(error)
        }
      }
      setQuotaRequests(tempQuotaRequests)
    } catch (error) {
      console.log(error)
      setQuotaRequests(initialValue)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    console.log('useQuotaRequests')
    fetchQuotaRequests(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context])

  return {
    isLoading,
    quotaRequests,
    fetchQuotaRequests,
    setQuotaRequests
  }
}