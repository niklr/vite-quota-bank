import { AppBar, Button, Toolbar, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { useConnectedWeb3Context } from '../../../hooks'
import { NetworkStore } from '../../../stores'
import { AccountList, LoginModal } from '../../account'
import { NetworkList } from '../../network'

const Root = styled.div`
  flex-grow: 1;
`

const TitleTypography = styled(Typography)`
  flex-grow: 1;
  margin-left: 10px !important;
`

export const Header: React.FC = (props: any) => {
  const networkStore = new NetworkStore()

  return (
    <Root>
      <AppBar position="static">
        <Toolbar>
          <img src={"./icon_white.png"} alt="logo" width="30" />
          <TitleTypography variant="h6">
            Vite Quota Bank
          </TitleTypography>
          <NetworkList networkStore={networkStore}></NetworkList>
        </Toolbar>
      </AppBar>
    </Root>
  )
}

export const HeaderConnected: React.FC = (props: any) => {
  const context = useConnectedWeb3Context()
  const networkStore = new NetworkStore()

  const { walletManager, provider } = context

  const wallet = walletManager.getWallet()

  const handleLogoutAsync = async () => {
    try {
      await provider.vite.connector?.killSessionAsync()
    } catch (error) {
      console.log(error)
    }
    walletManager.removeWallet()
    networkStore.clear()
    window.location.reload()
  }

  return (
    <Root>
      <AppBar position="static">
        <Toolbar>
          <img src={"./icon_white.png"} alt="logo" width="30" />
          <TitleTypography variant="h6">
            Vite Quota Bank
          </TitleTypography>
          <NetworkList networkStore={networkStore}></NetworkList>
          {wallet?.active && (
            <>
              <AccountList></AccountList>
              <Button color="inherit" onClick={async () => { await handleLogoutAsync() }}>Logout</Button>
            </>
          )}
          {!wallet?.active && (
            <LoginModal></LoginModal>
          )}
        </Toolbar>
      </AppBar>
    </Root>
  )
}