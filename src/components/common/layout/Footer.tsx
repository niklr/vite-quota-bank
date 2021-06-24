import { Typography } from '@material-ui/core'
import styled from 'styled-components'
import { useConnectedWeb3Context } from '../../../hooks'

const Root = styled.div<{ paddingBottomSmall?: boolean }>`
  padding-bottom: ${props => (props.paddingBottomSmall ? '10px' : '30px')};
  padding-top: 10px;
  padding-left: 24px;
  padding-right: 24px;
`

export const Footer = () => {
  const context = useConnectedWeb3Context()
  return (
    <>
      <Root paddingBottomSmall={true}>
        <Typography>Block Height: {context.networkStatus.blockHeight}</Typography>
      </Root>
    </>
  )
}
