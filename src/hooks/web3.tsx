import React from 'react';
import { IViteClient, ViteMockClient, ViteClient } from '../clients';
import { BankMockService, BankService, IBankService } from '../services';
import { Wallet, WalletManager } from '../wallet';
import { useWeb3Manager } from './web3Manager';

export interface IWeb3Context {
  setWallet: (wallet?: Wallet) => void,
  wallet?: Wallet,
  setError: (error: Error) => void,
  error?: Error,
  vite: IViteClient,
  bank: IBankService,
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
  let vite: IViteClient
  let bank: IBankService
  if (process.env.REACT_APP_USE_MOCK) {
    vite = new ViteMockClient()
    bank = new BankMockService(vite, walletManager)
  } else {
    vite = new ViteClient()
    bank = new BankService(vite, walletManager)
  }

  const {
    setWallet,
    wallet,
    setError,
    error
  } = useWeb3Manager(walletManager.getWallet())

  const context: IWeb3Context = {
    setWallet,
    wallet,
    setError,
    error,
    vite,
    bank,
    walletManager
  }

  return (
    <>
      <Web3Context.Provider value={context}>{props.children}</Web3Context.Provider>
    </>
  )
}
