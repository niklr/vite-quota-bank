import React, { useEffect, useState } from 'react';
import { ViteService } from '../services/vite';
import { Account } from '../wallet/account';
import { WalletConstants } from '../wallet/constants';

export interface IWeb3Context {
  account: Maybe<Account>,
  vite: ViteService
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
  const [context, setContext] = useState<IWeb3Context>({
    account: undefined,
    vite
  })


  const account = vite.createAccount(WalletConstants.DefaultMnemonics, 0)
  context.account = account

  useEffect(() => {
    console.log('web3.context?.account', context?.account)
  });

  // useEffect(() => {
  //   if (context) {
  //     console.log('web3.context.account', context.account)
  //   }
  // }, [context])

  return (
    <>
      <Web3Context.Provider value={context}>{props.children}</Web3Context.Provider>
    </>
  )
}
