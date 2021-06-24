import { Button, Typography } from '@material-ui/core'
import { useEffect, useState } from 'react'
import { useConnectedWeb3Context } from '../hooks'
import { Footer, Header, MainScroll, MainWrapper } from './common'

export const Main: React.FC = (props: any) => {
  const context = useConnectedWeb3Context()

  const [blockHeight, setBlockHeight] = useState(context.networkStatus.blockHeight);

  useEffect(() => {
    console.log('context.networkStatus.blockHeight', context.networkStatus.blockHeight)
  }, [context.networkStatus.blockHeight])

  const onClickHandler = () => {
    setBlockHeight(context.networkStatus.blockHeight)
    console.log('setBlockHeight', context.networkStatus.blockHeight)
  }

  return (
    <>
      <MainWrapper>
        <Header />
        <MainScroll>
          <Button onClick={onClickHandler}>Press me</Button>
          <Typography>NetworkId: {context.network.id} / {blockHeight}</Typography>
        </MainScroll>
        <Footer />
      </MainWrapper>
    </>
  )
}
