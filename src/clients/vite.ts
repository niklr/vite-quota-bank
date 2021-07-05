import { abi as abiutils, utils, ViteAPI } from '@vite/vitejs';
import { Balance, Quota } from '../types';
import { Task } from '../util/task';
const { WS_RPC } = require('@vite/vitejs-ws');

const providerTimeout = 60000;
const providerOptions = { retryTimes: 10, retryInterval: 5000 };

export interface IViteClient {
  readonly isConnected: boolean
  initAsync(url: string): Promise<void>
  dispose(): void
  getSnapshotChainHeightAsync(): Promise<string>
  getBalanceByAccount(address: string): Promise<Balance>
  getQuotaByAccount(address: string): Promise<Quota>
  callOffChainMethodAsync(contractAddress: string, abi: any, offchaincode: string, params: any): Promise<any>
  waitForAccountBlockAsync(address: string, height: string): Promise<any>
}

export class ViteClient implements IViteClient {

  private _provider: any;
  private _client: any;
  private _isConnected = false;

  get isConnected(): boolean {
    return this._isConnected;
  }

  initAsync = async (url: string) => new Promise<void>((resolve, reject) => {
    this._isConnected = false;
    if (this._provider) {
      this._provider.destroy();
    }
    this._provider = new WS_RPC(url, providerTimeout, providerOptions);
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

  dispose(): void {
    this._provider.disconnect();
    this._isConnected = false;
  }

  async requestAsync(method: string, params?: any): Promise<any> {
    if (this._isConnected) {
      return this._client.request(method, params);
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

  async callOffChainMethodAsync(contractAddress: string, abi: any, offchaincode: string, params: any): Promise<any> {
    let data = abiutils.encodeFunctionCall(abi, params);
    let dataBase64 = Buffer.from(data, "hex").toString("base64");
    let result = await this._provider.request("contract_callOffChainMethod", {
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

  async waitForAccountBlockAsync(address: string, height: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      let result: any = undefined;
      let error: any = undefined;
      const task = new Task(async () => {
        try {
          let blockByHeight = await this._provider.request(
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

          let blockByHash = await this._provider.request('ledger_getAccountBlockByHash', receiveBlockHash);
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