import { Container } from '@material-ui/core'
import * as React from 'react'
import styled from 'styled-components'
import { theme } from '../../../common/theme'

const MainScrollStyled = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center;
  padding-bottom: 15px;
  padding-top: 64px;
  position: relative;
  z-index: 2;

  @media (min-width: ${theme.breakpoints.values.md}) {
    overflow: auto;
    overflow-x: hidden;
  }
`

const MainScrollInner = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  margin: 0 auto;
  max-width: 100%;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  width: ${theme.breakpoints.values.xl};
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
