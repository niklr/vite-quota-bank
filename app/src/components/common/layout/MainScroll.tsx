import { Container } from '@material-ui/core'
import * as React from 'react'
import styled from 'styled-components'

const MainScrollStyled = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  padding-bottom: 15px;
  padding-top: 30px;
  overflow: auto;
  overflow-x: hidden;
`

const MainScrollInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const MainScroll: React.FC = props => {
  const { children, ...restProps } = props

  return (
    <MainScrollStyled {...restProps}>
      <Container maxWidth="lg">
        <MainScrollInner>{children}</MainScrollInner>
      </Container>
    </MainScrollStyled>
  )
}
