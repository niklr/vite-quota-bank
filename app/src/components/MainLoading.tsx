import { Typography } from '@material-ui/core'
import { Footer, Header, MainScroll, MainWrapper } from './common'

export const MainLoading = () => {

  return (
    <>
      <MainWrapper>
        <Header />
        <MainScroll>
          <Typography>Loading...</Typography>
        </MainScroll>
        <Footer />
      </MainWrapper>
    </>
  )
}
