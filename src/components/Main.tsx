import { Button, Typography } from '@material-ui/core'
import { useEffect } from 'react'
import { useConnectedWeb3Context } from '../hooks'
import { Footer, Header, MainScroll, MainWrapper } from './common'

export const Main: React.FC = (props: any) => {
  const context = useConnectedWeb3Context()
  let blockHeight = 0

  useEffect(() => {
    console.log(context.networkStatus.blockHeight)
  }, [context.networkStatus.blockHeight])

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
