import { Grid } from '@material-ui/core'
import { Footer, Header, MainScroll, MainWrapper } from './common'
import { NetworkCard } from './cards'
import { useConnectedWeb3Context } from '../hooks'
import { AccountQuotaRequestTable, AddressSummaryTable, BankQuotaRequestTable } from './tables'
import { AppConstants } from '../constants'
import { RequestQuota } from './account'

export const Main: React.FC = (props: any) => {
  const context = useConnectedWeb3Context()

  const testFn = () => {
    console.log('testFn called.')
  }

  return (
    <>
      <MainWrapper>
        <Header />
        <MainScroll>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <AddressSummaryTable title="My Account" address={context.account}></AddressSummaryTable>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <NetworkCard></NetworkCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AddressSummaryTable title="Bank" address={AppConstants.QuotaContractAddress}></AddressSummaryTable>
            </Grid>
            <Grid item xs={12}>
              <RequestQuota testFn={testFn}></RequestQuota>
            </Grid>
            <Grid item xs={12}>
              <AccountQuotaRequestTable></AccountQuotaRequestTable>
            </Grid>
            <Grid item xs={12}>
              <BankQuotaRequestTable></BankQuotaRequestTable>
            </Grid>
          </Grid>
        </MainScroll>
        <Footer />
      </MainWrapper>
    </>
  )
}
