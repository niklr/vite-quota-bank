import { Grid } from '@material-ui/core'
import { Footer, Header, MainScroll, MainWrapper } from './common'
import { AccountCard, NetworkCard } from './cards'

export const Main: React.FC = (props: any) => {
  return (
    <>
      <MainWrapper>
        <Header />
        <MainScroll>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <AccountCard></AccountCard>
            </Grid>
            <Grid item xs={12} md={4}>
              <NetworkCard></NetworkCard>
            </Grid>
          </Grid>
        </MainScroll>
        <Footer />
      </MainWrapper>
    </>
  )
}
