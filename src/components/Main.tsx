import { Button, Typography } from '@material-ui/core'
import { useEffect } from 'react'
import { useBlockHeight, useConnectedWeb3Context } from '../hooks'
import { Task } from '../util/task'
import { Footer, Header, MainScroll, MainWrapper } from './common'

export const Main: React.FC = (props: any) => {
  const context = useConnectedWeb3Context()
  const { blockHeight, fetchBlockHeight } = useBlockHeight(context)

  const task = new Task(async () => {
    context.networkStatus.blockHeight = context.networkStatus.blockHeight + 1
    console.log(context.networkStatus.blockHeight)
  }, 1000)
  // task.start()
  console.log('Main')

  return (
    <>
      <MainWrapper>
        <Header />
        <MainScroll>
          <Button>Press me</Button>
          <Typography>NetworkId: {context.network.id} / {blockHeight}</Typography>
        </MainScroll>
        <Footer />
      </MainWrapper>
    </>
  )
}
