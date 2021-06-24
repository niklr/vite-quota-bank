import { Button, Typography } from '@material-ui/core'
import { useConnectedWeb3Context } from '../hooks'
import { Footer, Header, MainScroll, MainWrapper } from './common'

export const Main: React.FC = (props: any) => {
  const context = useConnectedWeb3Context()
  return (
    <>
      <MainWrapper>
        <Header />
        <MainScroll>
          <Button>Press me</Button>
          <Typography>NetworkId: {context.network.id}</Typography>
        </MainScroll>
        <Footer />
      </MainWrapper>
    </>
  )
}
