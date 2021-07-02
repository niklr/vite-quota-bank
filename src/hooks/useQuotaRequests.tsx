import { useEffect, useState } from 'react'
import { IConnectedWeb3Context } from '.'

export const useQuotaRequests = (context: IConnectedWeb3Context) => {
  const initialValue: string[] = []
  const [quotaRequests, setQuotaRequests] = useState(initialValue)

  const fetchQuotaRequests = async () => {
    try {
      const result = await context.vite.getQuotaRequests()
      setQuotaRequests(result)
    } catch (error) {
      setQuotaRequests(initialValue)
    }
  }

  useEffect(() => {
    fetchQuotaRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context])

  return {
    quotaRequests,
    fetchQuotaRequests
  }
}