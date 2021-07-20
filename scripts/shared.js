const { WS_RPC } = require("@vite/vitejs-ws");
const {
  ViteAPI,
  accountBlock,
  wallet,
  utils,
  abi: abiutils,
} = require("@vite/vitejs");
const BigNumber = require("bignumber.js");
const constants = require('./constants');
const Task = require('./task');

const mnemonic = constants.DEFAULT_MNEMONIC

// connect to node
const connection = new WS_RPC(constants.WS_RPC_URL);
const provider = new ViteAPI(connection, () => {
  console.log("client connected");
});

// derive account from mnemonic
const account0 = wallet.getWallet(mnemonic).deriveAddress(0);
const account1 = wallet.getWallet(mnemonic).deriveAddress(1);
const account2 = wallet.getWallet(mnemonic).deriveAddress(2);

const AccountBlock = accountBlock.AccountBlock;

function toTokenAmount(amount, units = constants.DEFAULT_DECIAMLS) {
  return new BigNumber(amount)
    .multipliedBy(new BigNumber(`1e${units || 0}`))
    .toFixed();
}

function fromTokenAmount(amount, units = constants.DEFAULT_DECIAMLS) {
  return new BigNumber(amount)
    .dividedBy(new BigNumber(`1e${units || 0}`))
    .toFixed();
}

function addBigNumbers(number1, number2) {
  return BigNumber(number1).plus(number2).toFixed();
}

function subtractBigNumbers(number1, number2) {
  return BigNumber(number1).minus(number2).toFixed();
}

async function getBalanceByAddress(address) {
  return provider.request("ledger_getAccountInfoByAddress", address);
}

async function getQuotaByAddress(address) {
  return provider.request("contract_getQuotaByAccount", address);
}

async function receiveTransaction(account) {
  // get the first unreceived tx
  const data = await provider.request(
    "ledger_getUnreceivedBlocksByAddress",
    account.address,
    0,
    1
  );

  if (!data || !data.length) {
    console.log("[LOG] No Unreceived Blocks");
    return;
  }
  // create a receive tx
  const ab = accountBlock
    .createAccountBlock("receive", {
      address: account.address,
      sendBlockHash: data[0].hash,
    })
    .setProvider(provider)
    .setPrivateKey(account.privateKey);

  await ab.autoSetPreviousAccountBlock();
  const result = await ab.sign().send();
  return result;
}

async function receiveAllOnroadTx(account) {
  const RECEIVE_PER_ROUND = 10;
  let blocks = await provider.request(
    "ledger_getUnreceivedBlocksByAddress",
    account.address,
    0,
    RECEIVE_PER_ROUND
  );

  for (let i = 0; i < blocks.length; i++) {
    let block = blocks[i];
    // receive on road
    await receiveTransaction(account, provider);
  }
  if (blocks.length >= RECEIVE_PER_ROUND) {
    await receiveAllOnroadTx(account, provider);
  }
}

async function sendTx(account, address, amount) {
  const ab = accountBlock
    .createAccountBlock("send", {
      address: account.address,
      toAddress: address,
      amount,
    })
    .setProvider(provider)
    .setPrivateKey(account.privateKey);

  await ab.autoSetPreviousAccountBlock();
  const result = await ab.sign().send();
  return result;
}

async function stakeForQuota(account, address, amount) {
  const ab = accountBlock
    .createAccountBlock("stakeForQuota", {
      address: account.address,
      beneficiaryAddress: address,
      amount,
    })
    .setProvider(provider)
    .setPrivateKey(account.privateKey);

  await ab.autoSetPreviousAccountBlock();
  const result = await ab.sign().send();
  return result;
}

async function callContract(
  account,
  methodName,
  abi,
  params,
  amount,
  toAddress
) {
  const block = accountBlock
    .createAccountBlock("callContract", {
      address: account.address,
      abi,
      methodName,
      amount,
      toAddress,
      params,
    })
    .setProvider(provider)
    .setPrivateKey(account.privateKey);

  await block.autoSetPreviousAccountBlock();
  const result = await block.sign().send();
  return result;
}

// https://github.com/vitelabs/soliditypp-vscode/blob/f869e5356a2f5d0c0003835e41fe5830eed67688/view/global/vite.js#L119
async function callOffChainMethod(
  contractAddress,
  abi,
  offchaincode,
  params
) {
  let data = abiutils.encodeFunctionCall(abi, params);
  let dataBase64 = Buffer.from(data, "hex").toString("base64");
  let result = await provider.request("contract_callOffChainMethod", {
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
    return resultList;
  }
  return "";
}

function decodeVmLog(vmLog, abi) {
  let topics = vmLog.topics;
  for (let j = 0; j < abi.length; j++) {
    let abiItem = abi[j];

    if (abiutils.encodeLogSignature(abiItem) === topics[0]) {
      let dataBytes = "";
      if (vmLog.data) {
        dataBytes = utils._Buffer.from(vmLog.data, "base64");
      }
      let log = {
        topic: topics[0],
        args: abiutils.decodeLog(
          abiItem.inputs,
          dataBytes.toString("hex"),
          topics.slice(1)
        ),
        event: abiItem.name,
      };
      return log;
    }
  }
}

function createAddressListener(address) {
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
  return provider.subscribe("createVmlogSubscription", JSON.parse(tempPayload));
}

function waitForNextBlocks(blocks = 1) {
  return new Promise(async (resolve) => {
    let counter = 0;
    const listener = await provider.subscribe("newSnapshotBlocks");
    listener.on(async (results) => {
      if (results.length !== 1) {
        console.log(results)
        throw new Error('Unexpected results');
      }
      counter++;
      let lastSnapshotBlock = results[results.length - 1];
      console.log('waitForNextBlocks', lastSnapshotBlock);
      if (counter >= blocks) {
        provider.unsubscribe(listener);
        resolve();
      }
    });
  });
}

function waitForNextVmLogEvent(listener, abi) {
  console.log('waitForNextVmLogEvent');
  return new Promise(async (resolve) => {
    // listener = EventEmitter
    // https://github.com/vitelabs/vite.js/blob/14b87a6ddc68fe5836816f949f85d6161e6cfed8/src/viteAPI/eventEmitter.ts
    listener.on(async (results) => {
      if (results.length !== 1) {
        console.log(results)
        throw new Error('Unexpected results');
      }
      const result = results[results.length - 1];
      // console.log(result);
      const vmLog = decodeVmLog(result.vmlog, abi);
      console.log(vmLog);
      // https://github.com/vitelabs/vite.js/blob/14b87a6ddc68fe5836816f949f85d6161e6cfed8/src/viteAPI/provider.ts
      // Don't unsubscribe, listener should be reusable!
      // provider.unsubscribe(listener);
      resolve(vmLog);
    });
  });
}

async function waitForAccountBlock(address, height) {
  return new Promise(async (resolve, reject) => {
    let result = undefined;
    let error = undefined;
    const task = new Task(async () => {
      try {
        let blockByHeight = await provider.request(
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

        let blockByHash = await provider.request('ledger_getAccountBlockByHash', receiveBlockHash);
        if (!blockByHash) {
          return true;
        }

        result = {
          ...getAccountBlockStatus(blockByHash),
          accountBlock: blockByHash
        }

        return false;
      } catch (err) {
        console.log(err);
        error = err;
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

function resolveAccountBlockData(accountBlock) {
  if (
    (accountBlock.blockType != 4 && accountBlock.blockType != 5) ||
    !accountBlock.data
  ) {
    return 0;
  }
  let bytes = utils._Buffer.from(accountBlock.data, 'base64');

  if (bytes.length != 33) {
    return 0;
  }
  return bytes[32];
}

function getAccountBlockStatus(accountBlock) {
  let status = resolveAccountBlockData(accountBlock);
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

async function fundAccount(account, amount = 100) {
  const block = new AccountBlock({
    blockType: 2,
    address: account0.address,
    toAddress: account.address,
    tokenId: constants.VITE_TOKEN_ID,
    amount: toTokenAmount(amount)
  });
  block.setProvider(provider).setPrivateKey(account0.privateKey);

  await block.autoSend();
  await receiveAllOnroadTx(account);
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function assert(condition, message) {
  if (!condition) {
    if (typeof message === 'object' && message !== null) {
      throw new Error(JSON.stringify(message, undefined, 2))
    } else {
      throw new Error(message || 'Assertion failed');
    }
  }
}

module.exports = {
  sharedModule: {
    connection: connection,
    provider: provider,
    account0: account0,
    account1: account1,
    account2: account2,
    toTokenAmount: toTokenAmount,
    fromTokenAmount: fromTokenAmount,
    addBigNumbers: addBigNumbers,
    subtractBigNumbers: subtractBigNumbers,
    getBalanceByAddress: getBalanceByAddress,
    getQuotaByAddress: getQuotaByAddress,
    receiveTransaction: receiveTransaction,
    receiveAllOnroadTx: receiveAllOnroadTx,
    sendTx: sendTx,
    stakeForQuota: stakeForQuota,
    callContract: callContract,
    callOffChainMethod: callOffChainMethod,
    decodeVmLog: decodeVmLog,
    createAddressListener: createAddressListener,
    waitForNextBlocks: waitForNextBlocks,
    waitForNextVmLogEvent: waitForNextVmLogEvent,
    waitForAccountBlock: waitForAccountBlock,
    fundAccount: fundAccount,
    timeout: timeout,
    assert: assert,
  },
};
