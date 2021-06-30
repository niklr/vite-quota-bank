import React from 'react';
import { ViteService } from '../services/vite';
import { AccountContainer } from '../wallet';
import { useWeb3Manager } from './web3Manager';

export interface IWeb3Context {
  setAccountContainer: (account: AccountContainer) => void,
  accountContainer?: AccountContainer,
  setError: (error: Error) => void,
  error?: Error,
  vite: ViteService,
}

const Web3Context = React.createContext<Maybe<IWeb3Context>>(null)

export const useWeb3Context = () => {
  const context = React.useContext(Web3Context)

  if (!context) {
    throw new Error('Component rendered outside the provider tree')
  }

  return context
}

interface Props {
  children?: React.ReactNode
}

export const Web3Provider: React.FC<Props> = (props: Props) => {
  const vite = new ViteService()
  const {
    setAccountContainer,
    accountContainer,
    setError,
    error
  } = useWeb3Manager()

  const context: IWeb3Context = {
    setAccountContainer,
    accountContainer,
    setError,
    error,
    vite
  }

  return (
    <>
      <Web3Context.Provider value={context}>{props.children}</Web3Context.Provider>
    </>
  )
}
