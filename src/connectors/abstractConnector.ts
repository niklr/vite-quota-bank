import { EventEmitter } from 'events'
import { AbstractConnectorArguments, ConnectorEvent, ConnectorUpdate } from './types'

export abstract class AbstractConnector extends EventEmitter {
  public readonly supportedChainIds?: number[]

  constructor({ supportedChainIds }: AbstractConnectorArguments = {}) {
    super()
    this.supportedChainIds = supportedChainIds
  }

  public abstract activate(): Promise<ConnectorUpdate>
  public abstract getProvider(): Promise<any>
  public abstract getChainId(): Promise<number | string>
  public abstract getAccount(): Promise<null | string>
  public abstract deactivate(): void

  protected emitUpdate(update: ConnectorUpdate): void {
    if (process.env.REACT_APP_IS_DEV) {
      console.log(`Emitting '${ConnectorEvent.Update}' with payload`, update)
    }
    this.emit(ConnectorEvent.Update, update)
  }

  protected emitError(error: Error): void {
    if (process.env.REACT_APP_IS_DEV) {
      console.log(`Emitting '${ConnectorEvent.Error}' with payload`, error)
    }
    this.emit(ConnectorEvent.Error, error)
  }

  protected emitDeactivate(): void {
    if (process.env.REACT_APP_IS_DEV) {
      console.log(`Emitting '${ConnectorEvent.Deactivate}'`)
    }
    this.emit(ConnectorEvent.Deactivate)
  }
}