import { Typography } from '@material-ui/core'
import styled from 'styled-components'

const Root = styled.div<{ paddingBottomSmall?: boolean }>`
  padding-bottom: ${props => (props.paddingBottomSmall ? '10px' : '30px')};
  padding-top: 10px;
  padding-left: 24px;
  padding-right: 24px;
`

export const Footer = () => {
  return (
    <>
      <Root paddingBottomSmall={true}>
        <Typography>Block Height: 1234</Typography>
      </Root>
    </>
  )
}
