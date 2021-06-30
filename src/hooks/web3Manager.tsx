import { useCallback, useReducer } from 'react'
import { Wallet } from '../wallet'

interface Web3ManagerState {
  wallet?: Wallet
  onError?: (error: Error) => void
  error?: Error
}

enum ActionType {
  UPDATE,
  ERROR
}

interface Action {
  type: ActionType
  payload?: any
}

function reducer(state: Web3ManagerState, { type, payload }: Action): Web3ManagerState {
  switch (type) {
    case ActionType.UPDATE: {
      const { accountContainer } = payload
      return {
        ...state,
        ...(accountContainer === undefined ? {} : { accountContainer })
      }
    }
    case ActionType.ERROR: {
      const { error } = payload
      const { onError } = state
      return {
        error,
        onError
      }
    }
  }
}

export const useWeb3Manager = () => {
  const [state, dispatch] = useReducer(reducer, {})
  // const { account, onError, error } = state
  const { wallet, error } = state

  const setWallet = useCallback((wallet: Wallet): void => {
    dispatch({ type: ActionType.UPDATE, payload: { wallet } })
  }, [])

  const setError = useCallback((error: Error): void => {
    dispatch({ type: ActionType.ERROR, payload: { error } })
  }, [])

  // const handleError = useCallback(
  //   (error: Error): void => {
  //     onError ? onError(error) : dispatch({ type: ActionType.ERROR, payload: { error } })
  //   },
  //   [onError]
  // )

  // ensure that events emitted from the set connector are handled appropriately
  // useEffect((): (() => void) => {
  //   if (connector) {
  //     connector
  //       .on(ConnectorEvent.Update, handleUpdate)
  //       .on(ConnectorEvent.Error, handleError)
  //       .on(ConnectorEvent.Deactivate, handleDeactivate)
  //   }

  //   return () => {
  //     if (connector) {
  //       connector
  //         .off(ConnectorEvent.Update, handleUpdate)
  //         .off(ConnectorEvent.Error, handleError)
  //         .off(ConnectorEvent.Deactivate, handleDeactivate)
  //     }
  //   }
  // }, [connector, handleUpdate, handleError, handleDeactivate])

  return { setWallet, wallet, setError, error }
}