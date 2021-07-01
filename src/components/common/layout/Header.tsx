import { AppBar, Button, Toolbar, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { useWeb3Context } from '../../../hooks'
import { AccountList, LoginModal } from '../../account'

const Root = styled.div`
  flex-grow: 1;
`

const TitleTypography = styled(Typography)`
  flex-grow: 1;
`

const HeaderContainer: React.FC = (props: any) => {
  const context = useWeb3Context()

  const { wallet } = context

  const handleLogout = () => {
    context.walletManager.removeWallet()
    context.setWallet(context.walletManager.getWallet())
  }

  return (
    <Root>
      <AppBar position="static">
        <Toolbar>
          <TitleTypography variant="h6">
            Vite Quota Bank
          </TitleTypography>
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