export interface Network {
  id: number
  name: string
  url: string
}

export interface NetworkStatus {
  blockHeight: string
}

export const networks = [
  {
    id: 1,
    name: 'MAINNET',
    url: 'wss://node.vite.net/gvite/ws'
  },
  {
    id: 2,
    name: 'TESTNET',
    url: 'wss://buidl.vite.net/gvite/ws' // https://buidl.vite.net/gvite
  },
  {
    id: 5,
    name: 'DEBUG',
    url: 'ws://localhost:23457'
  }
] as Network[]

export const getNetworkFromChain = (chain: string) => {
  return networks.find(e => e.id === Number(chain))
}