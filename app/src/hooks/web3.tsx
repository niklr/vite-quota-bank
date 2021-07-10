import React from 'react';
import { WalletManager } from '../wallet';
import { useWeb3Manager } from './web3Manager';

export interface IWeb3Context {
  setError: (error: Error) => void,
  error?: Error,
  walletManager: WalletManager
}

const Web3Context = React.createContext<Maybe<IWeb3Context>>(undefined)

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
  const walletManager = new WalletManager()

  const {
    setWallet,
    setError,
    error
  } = useWeb3Manager(walletManager.getWallet())

  walletManager.onSetWalletCallback = setWallet

  const context: IWeb3Context = {
    setError,
    error,
    walletManager
  }

  return (
    <>
      <Web3Context.Provider value={context}>{props.children}</Web3Context.Provider>
    </>
  )
}
