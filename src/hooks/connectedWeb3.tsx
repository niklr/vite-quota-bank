import React, { useEffect, useState } from 'react';
import { useWeb3Context } from '.';
import { ServiceProvider } from '../providers';

export interface IConnectedWeb3Context {
  account?: string
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
  networkId?: number | null
  setStatus?: any
}

/**
 * Component used to render components that depend on Web3 being available. These components can then
 * `useConnectedWeb3Context` safely to get web3 stuff without having to null check it.
 */
export const ConnectedWeb3: React.FC<Props> = (props: Props) => {
  const [connection, setConnection] = useState<IConnectedWeb3Context | null>(null)
  const [isReady, setIsReady] = useState<boolean>(false)
  const context = useWeb3Context()

  const { wallet, walletManager } = context

  useEffect(() => {
    if (props.networkId) {
      console.log('networkId', props.networkId)
      const provider = new ServiceProvider(walletManager)
      const network = provider.networkStore.getById(props.networkId)
      if (!network) throw new Error(`Network with id '${props.networkId}' is not defined`)

      provider.networkStore.network = network

      const value = {
        account: wallet?.active?.address,
        provider
      }

      console.log('ConnectedWeb3.account', wallet?.active?.address)

      setConnection(value)
    }
  }, [props.networkId, wallet, walletManager])

  useEffect(() => {
    if (connection) {
      const initAsync = async () => {
        console.log('initAsync')
        if (!connection.provider.networkStore.network?.url) {
          throw new Error('Network is not defined')
        } else {
          await connection.provider.vite.initAsync(connection.provider.networkStore.network?.url)
          setIsReady(true)
        }
      }
      if (!connection.provider.vite.isConnected) {
        initAsync()
      }
    }
  }, [connection])

  if (!props.networkId || !connection) {
    props.setStatus(true)
    return null
  }

  const value = {
    ...connection
  }

  props.setStatus(true)
  return (
    <>
      {isReady ? (
        <ConnectedWeb3Context.Provider value={value}>{props.children}</ConnectedWeb3Context.Provider>
      ) : (
        <>
          <div>Connecting...</div>
        </>
      )}
    </>
  )
}

export const WhenConnected: React.FC<Props> = props => {
  const { account } = useConnectedWeb3Context()

  return <>{account && props.children}</>
}
