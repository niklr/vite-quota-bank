import { useEffect, useState } from 'react'
import { Subject } from 'rxjs';
import { IConnectedWeb3Context } from '.'
import { AppConstants } from '../constants';

export const useBlockHeight = (context: IConnectedWeb3Context) => {
  const [blockHeight, setBlockHeight] = useState(AppConstants.InitialNetworkBlockHeight)
  const blockHeightSubject = new Subject<string>()

  const fetchBlockHeight = async () => {
    let newBlockHeight: string
    try {
      newBlockHeight = await context.provider.vite.getSnapshotChainHeightAsync()

    } catch (error) {
      newBlockHeight = AppConstants.InitialNetworkBlockHeight
    }
    setBlockHeight(newBlockHeight)
    context.provider.networkStore.blockHeight = newBlockHeight
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