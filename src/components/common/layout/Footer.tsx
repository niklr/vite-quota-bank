import { Typography } from '@material-ui/core'
import { useEffect } from 'react'
import styled from 'styled-components'
import { useBlockHeight, useConnectedWeb3Context } from '../../../hooks'
import { Task } from '../../../util/task'

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
    const task = new Task(fetchBlockHeight, 1000)
    task.start()
    return () => {
      console.log('asdf')
      task.stop()
    }
  })

  console.log('Footer')

  return (
    <>
      <Root paddingBottomSmall={true}>
        <Typography>Block Height: {blockHeight}</Typography>
      </Root>
    </>
  )
}
