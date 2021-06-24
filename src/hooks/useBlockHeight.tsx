import { useEffect, useState } from 'react'
import { IConnectedWeb3Context } from '.'

export const useBlockHeight = (context: IConnectedWeb3Context) => {
  const [blockHeight, setBlockHeight] = useState(0)
  console.log('useBlockHeight')
  const fetchBlockHeight = async () => {
    setBlockHeight(blockHeight + 1)
    context.networkStatus.blockHeight = blockHeight
    console.log('fetchBlockHeight', blockHeight, context.networkStatus.blockHeight)
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