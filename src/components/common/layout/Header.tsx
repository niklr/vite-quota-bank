import { AppBar, Toolbar, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { useWeb3Context } from '../../../hooks'
import { truncateStringInTheMiddle } from '../../../util/tools'
import { AccountList, LoginModal } from '../../account'

const Root = styled.div`
  flex-grow: 1;
`

const TitleTypography = styled(Typography)`
  flex-grow: 1;
`

const HeaderContainer: React.FC = (props: any) => {
  const context = useWeb3Context()

  const { accountContainer } = context

  return (
    <Root>
      <AppBar position="static">
        <Toolbar>
          <TitleTypography variant="h6">
            Vite Quota Bank
          </TitleTypography>
          <LoginModal></LoginModal>
          <Typography>{truncateStringInTheMiddle(accountContainer?.active?.address, 10, 5)}</Typography>
          <AccountList></AccountList>
        </Toolbar>
      </AppBar>
    </Root>
  )
}

export const Header = HeaderContainer