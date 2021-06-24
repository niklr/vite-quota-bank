import { AppBar, Button, Toolbar, Typography } from '@material-ui/core'
import styled from 'styled-components'
import { AccountList } from '../../account'

const Root = styled.div`
  flex-grow: 1;
`

const TitleTypography = styled(Typography)`
  flex-grow: 1;
`

const HeaderContainer: React.FC = (props: any) => {
  return (
    <Root>
      <AppBar position="static">
        <Toolbar>
          <TitleTypography variant="h6">
            Vite Quota Bank
          </TitleTypography>
          <Button color="inherit">Login</Button>
          <AccountList></AccountList>
        </Toolbar>
      </AppBar>
    </Root>
  )
}

export const Header = HeaderContainer