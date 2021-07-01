import { Grid } from '@material-ui/core'
import { Footer, Header, MainScroll, MainWrapper } from './common'
import { NetworkCard } from './network'

export const Main: React.FC = (props: any) => {
  return (
    <>
      <MainWrapper>
        <Header />
        <MainScroll>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <NetworkCard></NetworkCard>
            </Grid>
            <Grid item xs={12} md={6}>
              <NetworkCard></NetworkCard>
            </Grid>
          </Grid>
        </MainScroll>
        <Footer />
      </MainWrapper>
    </>
  )
}
