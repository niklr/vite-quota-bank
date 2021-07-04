import { AppBar, Button, Toolbar, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { useWeb3Context } from '../../../hooks'
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

const HeaderContainer: React.FC = (props: any) => {
  const context = useWeb3Context()
  const networkStore = new NetworkStore()

  const { wallet } = context

  const handleLogout = () => {
    context.walletManager.removeWallet()
    context.setWallet(context.walletManager.getWallet())
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
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
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

export const Header = HeaderContainer