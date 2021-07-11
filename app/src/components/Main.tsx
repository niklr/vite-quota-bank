import { useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { AddressSummaryTable, ConfirmTransactionDialog, Footer, HeaderConnected, Logo, MainScroll, MainWrapper } from './common'
import { NetworkCard } from './network'
import { AccountQuotaRequestTable, CreateQuotaRequest } from './quota_request'
import { BankQuotaRequestTable } from './quota_request_list'
import { useConnectedWeb3Context } from '../hooks'
import { AppConstants } from '../constants'

export const Main: React.FC = (props: any) => {
  const context = useConnectedWeb3Context()

  useEffect(() => {
    async function getOwnerAsync() {
      const owner = await context.provider.bank.getOwnerAsync()
      console.log('Bank owner:', owner)
    }
    getOwnerAsync()
  }, [context])

  return (
    <>
      <MainWrapper>
        <HeaderConnected />
        <MainScroll>
          <Logo></Logo>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <AddressSummaryTable title="My Account" address={context.account}></AddressSummaryTable>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <NetworkCard></NetworkCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <AddressSummaryTable title="Bank" address={AppConstants.BankContractAddress}></AddressSummaryTable>
            </Grid>
            <Grid item xs={12}>
              <CreateQuotaRequest></CreateQuotaRequest>
            </Grid>
            <Grid item xs={12}>
              <AccountQuotaRequestTable></AccountQuotaRequestTable>
            </Grid>
            <Grid item xs={12}>
              <BankQuotaRequestTable></BankQuotaRequestTable>
            </Grid>
          </Grid>
          <ConfirmTransactionDialog></ConfirmTransactionDialog>
        </MainScroll>
        <Footer />
      </MainWrapper>
    </>
  )
}
