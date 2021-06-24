import { useEffect, useState } from 'react'
import { IConnectedWeb3Context } from '.'
import { Task } from '../util/task'

export const useBlockHeight = (context: IConnectedWeb3Context) => {
  const [blockHeight, setBlockHeight] = useState(0)
  console.log('useBlockHeight')
  const fetchBlockHeight = async () => {
    setBlockHeight(blockHeight + 1)
    context.networkStatus.blockHeight = context.networkStatus.blockHeight + 1
    console.log('fetchBlockHeight', blockHeight, context.networkStatus.blockHeight)
  }

  useEffect(() => {
    console.log('useBlockHeightEffect')
    fetchBlockHeight()
    const task = new Task(fetchBlockHeight, 1000)
    task.start()
    return () => {
      console.log('asdf')
      task.stop()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    blockHeight,
    fetchBlockHeight
  }
}