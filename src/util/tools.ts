import axios from 'axios'
import { networks } from '../common/networks'

export const getNetworkFromChain = (chain: string) => {
  return networks.find(e => e.id === Number(chain))
}

export const checkRpcStatus = async (customUrl: string, setStatus: any, network: any) => {
  try {
    const response = await axios.post(customUrl, {
      id: +new Date(),
      jsonrpc: '2.0',
      method: 'net_version',
    })
    if (response.data.error || +response.data.result !== network) {
      setStatus(false)
      return false
    }

    setStatus(true)
    return true
  } catch (e) {
    setStatus(false)
    return false
  }
}