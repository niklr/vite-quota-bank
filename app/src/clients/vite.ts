import { abi as abiutils, accountBlock, utils, ViteAPI } from '@vite/vitejs';
import { IGlobalEmitter } from '../emitters';
import { Balance, IVmLog, Network, Quota } from '../types';
import { Task } from '../util/task';
import { IWalletConnector, SessionWalletAccount, WalletAccount, WalletConnectorFactory, WebWalletAccount } from '../wallet';
const { WS_RPC } = require('@vite/vitejs-ws');

const providerTimeout = 60000;
const providerOptions = { retryTimes: 10, retryInterval: 5000 };

export interface IViteClient {
  readonly isConnected: boolean
  readonly connector: Maybe<IWalletConnector>
  initAsync(network: Network): Promise<void>
  dispose(): void
  getSnapshotChainHeightAsync(): Promise<string>
  getBalanceByAccount(address: string): Promise<Balance>
  getQuotaByAccount(address: string): Promise<Quota>
  callContractAsync(account: WalletAccount, methodName: string, abi: any, params: any, amount: string, toAddress: string): Promise<any>
  callOffChainMethodAsync(contractAddress: string, abi: any, offchaincode: string, params: any): Promise<any>
  decodeVmLog(vmLog: any, abi: any): Maybe<IVmLog>
  createAddressListenerAsync(address: string): Promise<any>
  removeListener(event: any): void
  waitForAccountBlockAsync(address: string, height: string): Promise<any>
}

export class ViteClient implements IViteClient {
  private readonly _emitter: IGlobalEmitter;
  private readonly _factory: WalletConnectorFactory;
  private _connector?: IWalletConnector;
  private _provider?: any;
  private _client?: any;
  private _isConnected = false;

  constructor(emitter: IGlobalEmitter, factory: WalletConnectorFactory) {
    this._emitter = emitter;
    this._factory = factory;
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  get connector(): Maybe<IWalletConnector> {
    return this._connector
  }

  initAsync = async (network: Network) => new Promise<void>((resolve, reject) => {
    this._isConnected = false;
    if (this._provider) {
      this._provider.destroy();
    }
    this._connector = this._factory.create(network)
    this._provider = new WS_RPC(network.rpcUrl, providerTimeout, providerOptions);
    let isResolved = false;
    this._provider.on('error', (err: any) => {
      console.log(err);
      if (isResolved) return;
      reject(err);
      this._isConnected = false;
    });
    this._client = new ViteAPI(this._provider, () => {
      this._isConnected = true;
      console.log(`ViteAPI connected to ${this._provider.path}`);
      isResolved = true;
      resolve();
    });
  });

  initConnectorAsync = async (network: Network) => new Promise<void>((resolve, reject) => {

  });

  dispose(): void {
    console.log("Disposing ViteClient");
    this._provider?.disconnect();
    this._isConnected = false;
  }

  async requestAsync(method: string, ...args: any[]): Promise<any> {
    if (this._isConnected && this._client) {
      return this._client.request(method, ...args);
    } else {
      return Promise.reject('Vite client is not ready to make requests.');
    }
  }

  async getSnapshotChainHeightAsync(): Promise<string> {
    return this.requestAsync('ledger_getSnapshotChainHeight');
  }

  async getBalanceByAccount(address: string): Promise<Balance> {
    const result = await this.requestAsync("ledger_getAccountInfoByAddress", address);
    return new Balance(result);
  }

  async getQuotaByAccount(address: string): Promise<Quota> {
    const result = await this.requestAsync("contract_getQuotaByAccount", address);
    return new Quota(result);
  }

  async callContractAsync(
    account: WalletAccount, methodName: string, abi: any, params: any, amount: string, toAddress: string
  ): Promise<any> {
    let block = accountBlock
      .createAccountBlock("callContract", {
        address: account.address,
        abi,
        methodName,
        amount,
        toAddress,
        params,
      })

    if (account instanceof WebWalletAccount) {
      block = block.setProvider(this._client).setPrivateKey(account.privateKey);
      await block.autoSetPreviousAccountBlock();
      const result = await block.sign().send();
      return result;
    } else if (account instanceof SessionWalletAccount) {
      if (this.connector) {
        this._emitter.emitConfirmTransactionDialog(true);
        try {
          const result = await this.connector.sendTransactionAsync({
            block: block.accountBlock
          });
          this._emitter.emitConfirmTransactionDialog(false);
          return result;
        } catch (error) {
          this._emitter.emitConfirmTransactionDialog(false);
          throw error
        }
      } else {
        throw new Error("Connector is not defined");
      }
    } else {
      throw new Error("Account not supported");
    }
  }

  async callOffChainMethodAsync(contractAddress: string, abi: any, offchaincode: string, params: any): Promise<any> {
    let data = abiutils.encodeFunctionCall(abi, params);
    let dataBase64 = Buffer.from(data, "hex").toString("base64");
    let result = await this.requestAsync("contract_callOffChainMethod", {
      selfAddr: contractAddress,
      offChainCode: offchaincode,
      data: dataBase64,
    });
    if (result) {
      let resultBytes = Buffer.from(result, "base64").toString("hex");
      let outputs = [];
      for (let i = 0; i < abi.outputs.length; i++) {
        outputs.push(abi.outputs[i].type);
      }
      let offchainDecodeResult = abiutils.decodeParameters(outputs, resultBytes);
      let resultList = [];
      if (offchainDecodeResult) {
        for (let i = 0; i < abi.outputs.length; i++) {
          if (abi.outputs[i].name) {
            resultList.push({
              name: abi.outputs[i].name,
              value: offchainDecodeResult[i],
            });
          } else {
            resultList.push({
              name: "",
              value: offchainDecodeResult[i],
            });
          }
        }
      }
      return resultList;
    }
    return "";
  }

  decodeVmLog(vmLog: any, abi: any): Maybe<IVmLog> {
    let topics = vmLog.topics;
    for (let j = 0; j < abi.length; j++) {
      let abiItem = abi[j];
      if (abiutils.encodeLogSignature(abiItem) === topics[0]) {
        if (vmLog.data) {
          let log = {
            topic: topics[0],
            args: abiutils.decodeLog(
              abiItem.inputs,
              utils._Buffer.from(vmLog.data, "base64").toString("hex"),
              topics.slice(1)
            ),
            event: abiItem.name,
          };
          return log;
        }
      }
    }
    return undefined;
  }

  async createAddressListenerAsync(address: string): Promise<any> {
    const payload = {
      addressHeightRange: {
        placeholder: {
          fromHeight: "0",
          toHeight: "0",
        },
      },
    };
    let tempPayload = JSON.stringify(payload);
    tempPayload = tempPayload.replace("placeholder", address);
    const result = await this._client?.subscribe("createVmlogSubscription", JSON.parse(tempPayload));
    return result;
  }

  removeListener(event: any): void {
    this._client?.unsubscribe(event);
  }

  async waitForAccountBlockAsync(address: string, height: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let result: any = undefined;
      let error: any = undefined;
      const task = new Task(async () => {
        try {
          let blockByHeight = await this.requestAsync(
            'ledger_getAccountBlockByHeight',
            address,
            height
          );

          if (!blockByHeight) {
            return true;
          }

          let receiveBlockHash = blockByHeight.receiveBlockHash;
          if (!receiveBlockHash) {
            return true;
          }

          let blockByHash = await this.requestAsync('ledger_getAccountBlockByHash', receiveBlockHash);
          if (!blockByHash) {
            return true;
          }

          result = {
            ...this.getAccountBlockStatus(blockByHash),
            accountBlock: blockByHash
          }

          return false;
        } catch (err) {
          error = err
          return false;
        }
      }, 500);
      task.start(() => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }

  private getAccountBlockStatus(accountBlock: any) {
    let status = this.resolveAccountBlockData(accountBlock);
    let statusTxt = '';
    switch (status) {
      case 0:
        statusTxt = '0, Execution succeed';
        break;
      case 1:
        statusTxt = '1, Execution reverted';
        break;
      case 2:
        statusTxt = '2, Max call depth exceeded';
        break;
    }
    return {
      status,
      statusTxt
    };
  }

  private resolveAccountBlockData(accountBlock: any) {
    if (
      (accountBlock.blockType !== 4 && accountBlock.blockType !== 5) ||
      !accountBlock.data
    ) {
      return 0;
    }
    let bytes = utils._Buffer.from(accountBlock.data, 'base64');

    if (bytes.length !== 33) {
      return 0;
    }
    return bytes[32];
  }
}