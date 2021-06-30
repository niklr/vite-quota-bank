import { Typography } from '@material-ui/core'
import { useEffect } from 'react'
import styled from 'styled-components'
import { useBlockHeight, useConnectedWeb3Context } from '../../../hooks'

const Root = styled.div<{ paddingBottomSmall?: boolean }>`
  padding-bottom: ${props => (props.paddingBottomSmall ? '10px' : '30px')};
  padding-top: 10px;
  padding-left: 24px;
  padding-right: 24px;
`

export const Footer = () => {
  const context = useConnectedWeb3Context()
  const { blockHeight, fetchBlockHeight } = useBlockHeight(context)

  useEffect(() => {
    let interval = setInterval(async () => {
      await fetchBlockHeight()
    }, 1000)
    return () => {
      // console.log('Footer interval cleared')
      clearInterval(interval);
    }
  })

  // console.log('Footer')

  return (
    <>
      <Root paddingBottomSmall={true}>
        <Typography>Block Height: {blockHeight} / v{process.env.REACT_APP_VERSION}</Typography>
      </Root>
    </>
  )
}
