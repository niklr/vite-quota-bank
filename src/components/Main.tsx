import { Grid } from '@material-ui/core'
import { Footer, Header, MainScroll, MainWrapper } from './common'
import { NetworkCard, QuotaCard } from './cards'
import { useConnectedWeb3Context } from '../hooks'
import { AddressSummaryTable } from './tables'

export const Main: React.FC = (props: any) => {
  const context = useConnectedWeb3Context()
  return (
    <>
      <MainWrapper>
        <Header />
        <MainScroll>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <AddressSummaryTable title="Account" address={context.account}></AddressSummaryTable>
            </Grid>
            <Grid item xs={12} md={4}>
              <QuotaCard title="Account Quota" address={context.account}></QuotaCard>
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
