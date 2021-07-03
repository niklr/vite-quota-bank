import { useEffect, useState } from 'react'
import { IConnectedWeb3Context } from '.'

export const useBlockHeight = (context: IConnectedWeb3Context) => {
  const defaultValue = '0'
  const [blockHeight, setBlockHeight] = useState(defaultValue)

  const fetchBlockHeight = async () => {
    try {
      const newBlockHeight = await context.vite.getSnapshotChainHeightAsync()
      setBlockHeight(newBlockHeight)
      context.networkStatus.blockHeight = newBlockHeight
    } catch (error) {
      setBlockHeight(defaultValue)
      context.networkStatus.blockHeight = defaultValue
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