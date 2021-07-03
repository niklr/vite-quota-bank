import { useEffect, useState } from 'react'
import { Subject } from 'rxjs';
import { IConnectedWeb3Context } from '.'

export const useBlockHeight = (context: IConnectedWeb3Context) => {
  const defaultValue = '0'
  const [blockHeight, setBlockHeight] = useState(defaultValue)
  const blockHeightSubject = new Subject<string>()

  const fetchBlockHeight = async () => {
    let newBlockHeight: string
    try {
      newBlockHeight = await context.vite.getSnapshotChainHeightAsync()

    } catch (error) {
      newBlockHeight = defaultValue
    }
    setBlockHeight(newBlockHeight)
    context.networkStatus.blockHeight = newBlockHeight
    blockHeightSubject.next(newBlockHeight)
  }

  useEffect(() => {
    // console.log('useBlockHeightEffect')
    fetchBlockHeight()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context])

  return {
    blockHeight,
    blockHeightSubject,
    fetchBlockHeight
  }
}