import { useEffect, useState } from 'react'
import { IConnectedWeb3Context } from '.'
import { Quota } from '../types'

export const useAccountQuota = (context: IConnectedWeb3Context, address?: string) => {
  const [quota, setQuota] = useState(new Quota())

  const fetchQuota = async () => {
    try {
      if (address) {
        const newQuota = await context.provider.vite.getQuotaByAccount(address)
        setQuota(newQuota)
      }
    } catch (error) {
      setQuota(new Quota())
    }
  }

  useEffect(() => {
    fetchQuota()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context])

  return {
    quota,
    fetchQuota,
    setQuota
  }
}