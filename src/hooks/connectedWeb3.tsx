import React, { useEffect, useState } from 'react';
import { Network, networks } from '../common/networks';
import { ViteService } from '../services/vite';
import { Account } from '../wallet/account';
import { WalletConstants } from '../wallet/constants';

export interface IConnectedWeb3Context {
  account: Maybe<Account>
  network: Network
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
  // const [networkId, setNetworkId] = useState<number | null>(null)

  useEffect(() => {
    if (props.networkId) {
      console.log('networkId', props.networkId)
      const network = networks.find(e => e.id === props.networkId)
      if (!network) throw new Error(`Network with id '${props.networkId}' is not defined`)

      const vite = new ViteService()
      const account = vite.createAccount(WalletConstants.DefaultMnemonics, 0)
      console.log('account.address', account.address)

      const value = {
        account: account || null,
        vite,
        network
      }

      setConnection(value)
    }
  }, [props.networkId])

  useEffect(() => {
    if (connection) {
      const initAsync = async () => {
        await connection.vite.initAsync(connection.network.url)
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
  return <ConnectedWeb3Context.Provider value={value}>{props.children}</ConnectedWeb3Context.Provider>
}

export const WhenConnected: React.FC<Props> = props => {
  const { account } = useConnectedWeb3Context()

  return <>{account && props.children}</>
}
