import { useEffect, useState } from 'react'
import { IConnectedWeb3Context } from '.'
import { Balance } from '../types'

export const useAccountBalance = (context: IConnectedWeb3Context, address?: string) => {
  const [balance, setBalance] = useState(new Balance())

  const fetchBalance = async () => {
    try {
      if (address) {
        const newQuota = await context.provider.vite.getBalanceByAccount(address)
        setBalance(newQuota)
      }
    } catch (error) {
      setBalance(new Balance())
    }
  }

  useEffect(() => {
    fetchBalance()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context])

  return {
    balance,
    fetchBalance,
    setBalance
  }
}