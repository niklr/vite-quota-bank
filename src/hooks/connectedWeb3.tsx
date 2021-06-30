import React, { useEffect, useState } from 'react';
import { useWeb3Context } from '.';
import { Network, networks, NetworkStatus } from '../common/networks';
import { ViteService } from '../services/vite';

export interface IConnectedWeb3Context {
  account?: string
  network: Network
  networkStatus: NetworkStatus
  vite: ViteService
}

const ConnectedWeb3Context = React.createContext<Maybe<IConnectedWeb3Context>>(null)

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

  const { accountContainer, vite } = context

  useEffect(() => {
    console.log('connectedWeb3.context', context)
  }, [context])

  useEffect(() => {
    console.log('connectedWeb3.account', accountContainer?.active?.address)
  }, [accountContainer])

  useEffect(() => {
    if (props.networkId) {
      console.log('networkId', props.networkId)
      const network = networks.find(e => e.id === props.networkId)
      if (!network) throw new Error(`Network with id '${props.networkId}' is not defined`)

      const value = {
        account: accountContainer?.active?.address,
        network,
        networkStatus: {
          blockHeight: 0
        },
        vite
      }

      console.log('ConnectedWeb3.account', accountContainer?.active?.address)

      setConnection(value)
    }
  }, [props.networkId, accountContainer, vite])

  useEffect(() => {
    if (connection) {
      const initAsync = async () => {
        setIsReady(false)
        console.log('initAsync')
        await connection.vite.initAsync(connection.network.url)
        setIsReady(true)
      }
      initAsync()
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
