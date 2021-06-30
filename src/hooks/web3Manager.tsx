import { useCallback, useEffect, useReducer } from 'react'

interface Web3ManagerState {
  account?: null | string

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
      const { account } = payload
      return {
        ...state,
        ...(account === undefined ? {} : { account })
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
  const { account, onError, error } = state

  const setError = useCallback((error: Error): void => {
    dispatch({ type: ActionType.ERROR, payload: { error } })
  }, [])

  const handleError = useCallback(
    (error: Error): void => {
      onError ? onError(error) : dispatch({ type: ActionType.ERROR, payload: { error } })
    },
    [onError]
  )

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

  return { account, setError, error }
}