import React, { useEffect, useMemo, useState } from 'react';
import { useWeb3Context } from '.';
import { MainLoading } from '../components/MainLoading';
import { ServiceProvider } from '../providers';
import { WalletManager } from '../wallet';

export interface IConnectedWeb3Context {
  account?: string
  walletManager: WalletManager
  provider: ServiceProvider
}

const ConnectedWeb3Context = React.createContext<Maybe<IConnectedWeb3Context>>(undefined)

/**
 * This hook can only be used by components under the `ConnectedWeb3` component. Otherwise it will throw.
 */
export const useConnectedWeb3Context = () => {
  const context = React.useContext(ConnectedWeb3Context)

  if (!context) {
    throw new Error('Component rendered outside the provider tree')
  }

  return context
}

interface Props {
  children?: React.ReactNode
}

/**
 * Component used to render components that depend on Web3 being available. These components can then
 * `useConnectedWeb3Context` safely to get web3 stuff without having to null check it.
 */
export const ConnectedWeb3: React.FC<Props> = (props: Props) => {
  const [connection, setConnection] = useState<IConnectedWeb3Context | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const context = useWeb3Context()

  const { walletManager } = context

  const wallet = walletManager.getWallet()

  const provider = useMemo(() => {
    return new ServiceProvider(walletManager)
  }, [walletManager])

  useEffect(() => {
    const network = provider.networkStore.network
    if (!network) throw new Error('Network is not defined')

    const value = {
      account: wallet?.active?.address,
      walletManager,
      provider
    }

    console.log('ConnectedWeb3.account', wallet?.active?.address)

    const initAsync = async () => {
      console.log('ConnectedWeb3.initAsync')
      if (!value.provider.networkStore.network?.rpcUrl) {
        throw new Error('Network is not defined')
      } else {
        await value.provider.vite.initAsync(value.provider.networkStore.network)
      }
      await value.provider.bank.initAsync()
      setConnection(value)
      setIsConnected(true)
    }
    initAsync()
    return () => {
      provider.dispose()
    }
  }, [wallet, walletManager, provider])

  if (!connection) {
    return MainLoading()
  }

  const value = {
    ...connection
  }

  return (
    <>
      {isConnected ? (
        <ConnectedWeb3Context.Provider value={value}>{props.children}</ConnectedWeb3Context.Provider>
      ) : (
        <>
        </>
      )}
    </>
  )
}

export const WhenConnected: React.FC<Props> = props => {
  const { account } = useConnectedWeb3Context()

  return <>{account && props.children}</>
}
