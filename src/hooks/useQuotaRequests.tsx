import { useEffect, useState } from 'react'
import { IConnectedWeb3Context } from '.'

export const useQuotaRequests = (context: IConnectedWeb3Context) => {
  const [blockHeight, setBlockHeight] = useState(0)

  const fetchBlockHeight = async () => {
    try {
      const newBlockHeight = await context.vite.getSnapshotChainHeightAsync()
      setBlockHeight(newBlockHeight)
      context.networkStatus.blockHeight = newBlockHeight
    } catch (error) {
      setBlockHeight(0)
      context.networkStatus.blockHeight = 0
    }
  }

  useEffect(() => {
    // console.log('useBlockHeightEffect')
    fetchBlockHeight()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context])

  return {
    blockHeight,
    fetchBlockHeight
  }
}