import { useEffect, useState } from 'react'
import { IConnectedWeb3Context } from '.'

export const useBlockHeight = (context: IConnectedWeb3Context) => {
  const [blockHeight, setBlockHeight] = useState(0)

  const fetchBlockHeight = async () => {
    const newBlockHeight = await context.vite.getSnapshotChainHeightAsync()
    setBlockHeight(newBlockHeight)
    context.networkStatus.blockHeight = newBlockHeight
  }

  useEffect(() => {
    console.log('useBlockHeightEffect')
    fetchBlockHeight()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context])

  return {
    blockHeight,
    fetchBlockHeight
  }
}