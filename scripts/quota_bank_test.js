const constants = require('./constants');
const { deployModule } = require('./deploy');
const { sharedModule } = require('./shared');
const QuotaBank = require('./quota_bank');
const QuotaMock = require('./quota_mock');
const Quota = require('./quota');

const contractPath1 = "./contracts/QuotaMock.solpp";
const contractPath2 = "./contracts/QuotaBank.solpp";

async function deployContracts() {
  const quotaContract = await deployModule.deployContractPath(contractPath1);
  const bankContract = await deployModule.deployContractPath(contractPath2);

  const quotaBank = new QuotaBank(bankContract);
  await quotaBank.setQuotaContractAsync(sharedModule.account0, quotaContract.address);

  return {
    quota: quotaContract,
    bank: bankContract
  }
}

async function createAddressListener(contract) {
  const logs = [];
  const listener = await sharedModule.createAddressListener(contract.address);
  listener.on((results) => {
    for (let index = 0; index < results.length; index++) {
      const result = results[index];
      console.log(result);
      const vmLog = sharedModule.decodeVmLog(result.vmlog, contract.abi);
      logs.push(vmLog);
    }
  });
  return {
    logs,
    listener
  }
}

async function testOwner() {
  const bankContract = await deployModule.deployContractPath(contractPath2);
  const quotaBank = new QuotaBank(bankContract);

  const result1 = await quotaBank.getOwnerAsync();
  sharedModule.assert(result1 === sharedModule.account0.address, result1);
}

async function testQuotaContract() {
  const quotaContract = await deployModule.deployContractPath(contractPath1);
  const bankContract = await deployModule.deployContractPath(contractPath2);
  const quotaBank = new QuotaBank(bankContract);

  const addressResult1 = await quotaBank.getQuotaContractAsync();
  sharedModule.assert(addressResult1 === constants.QUOTA_CONTRACT_ADDR, addressResult1);

  const setResult1 = await quotaBank.setQuotaContractAsync(sharedModule.account0, quotaContract.address);
  sharedModule.assert(setResult1.status === 0, setResult1);

  const addressResult2 = await quotaBank.getQuotaContractAsync();
  sharedModule.assert(addressResult2 === quotaContract.address, addressResult2);
}

async function testFundAndWithdrawReserves() {
  const contract = await deployModule.deployContractPath(contractPath2);
  const quotaBank = new QuotaBank(contract);

  const getReservesResult0 = await quotaBank.getReservesAsync();
  sharedModule.assert(getReservesResult0 === '0', getReservesResult0)

  const amount = sharedModule.toTokenAmount(100);
  const fundResult1 = await quotaBank.fundReservesAsync(sharedModule.account0, amount);
  sharedModule.assert(fundResult1.status === 0, fundResult1);

  const getReservesResult1 = await quotaBank.getReservesAsync();
  sharedModule.assert(getReservesResult1 === amount, getReservesResult1)

  // Try to withdraw not as owner
  const withdrawResult1 = await quotaBank.withdrawReservesAsync(sharedModule.account1);
  sharedModule.assert(withdrawResult1.status === 1, withdrawResult1.status.toString());
  sharedModule.assert(withdrawResult1.statusTxt === '1, Execution reverted', withdrawResult1.statusTxt);

  const getReservesResult2 = await quotaBank.getReservesAsync();
  sharedModule.assert(getReservesResult2 === amount, getReservesResult2)

  // Try to withdraw as owner
  const withdrawResult2 = await quotaBank.withdrawReservesAsync(sharedModule.account0);
  sharedModule.assert(withdrawResult2.status === 0, withdrawResult2.status.toString());
  sharedModule.assert(withdrawResult2.statusTxt === '0, Execution succeed', withdrawResult2.statusTxt);

  const getReservesResult3 = await quotaBank.getReservesAsync();
  sharedModule.assert(getReservesResult3 === '0', getReservesResult3)
}

async function testCreateRequest1() {
  const contract = await deployModule.deployContractPath(contractPath2);
  const quotaBank = new QuotaBank(contract);

  const { logs, listener } = await createAddressListener(quotaBank.contract);

  // Try delete non-existing request
  await quotaBank.deleteRequestAsync(sharedModule.account0, sharedModule.account1.address);

  const result0 = await quotaBank.getRequestorsAsync();
  sharedModule.assert(result0.length === 0, result0);

  const result1 = await quotaBank.getRequestAsync(sharedModule.account1.address);
  const emptyRequestResult = {"expirationHeight":"0","amount":"0","note":""};
  sharedModule.assert(JSON.stringify(result1) === JSON.stringify(emptyRequestResult), result1);

  const result2 = await quotaBank.createRequestAsync(sharedModule.account1, "test 1234");
  sharedModule.assert(result2.status === 0, result2.status.toString());

  const result3 = await quotaBank.getRequestAsync(sharedModule.account1.address);
  sharedModule.assert(Number.parseInt(result3.expirationHeight) > 0, result3.expirationHeight);
  sharedModule.assert(result3.note === "test 1234", result3.note);

  const result4 = await quotaBank.getRequestorsAsync();
  sharedModule.assert(result4.length === 1, result4);

  await quotaBank.deleteRequestAsync(sharedModule.account0, sharedModule.account1.address);

  const result5 = await quotaBank.getRequestorsAsync();
  sharedModule.assert(result5.length === 0, result5);

  sharedModule.assert(logs.length === 2, logs.length.toString());
  const vmLog1 = logs[0];
  sharedModule.assert(vmLog1.event === 'RequestCreated', vmLog1.event);
  sharedModule.assert(vmLog1.args.addr === sharedModule.account1.address, vmLog1.args.addr);
  sharedModule.assert(vmLog1.args.note === "test 1234", vmLog1.args.note);
  const vmLog2 = logs[1];
  sharedModule.assert(vmLog2.event === 'RequestDeleted', vmLog2.event);
  sharedModule.assert(vmLog2.args.addr === sharedModule.account1.address, vmLog2.args.addr);
  sharedModule.assert(vmLog2.args.expirationHeight !== "0", vmLog2.args.expirationHeight);
  sharedModule.assert(vmLog2.args.amount === "0", vmLog2.args.amount);
  sharedModule.assert(vmLog2.args.note === "test 1234", vmLog2.args.note);
  logs.length = 0;
}

async function testCreateRequest2() {
  const contract = await deployModule.deployContractPath(contractPath2);
  const quotaBank = new QuotaBank(contract);

  const result0 = await quotaBank.getRequestorsAsync();
  sharedModule.assert(result0.length === 0, result0);

  const result2 = await quotaBank.createRequestAsync(sharedModule.account1, "test 1234");
  sharedModule.assert(result2.status === 0, result2.status.toString());

  const result3 = await quotaBank.createRequestAsync(sharedModule.account1, "test 4321");
  sharedModule.assert(result3.status === 1, result3.status.toString());

  const result4 = await quotaBank.getRequestorsAsync();
  sharedModule.assert(result4.length === 1, result4);
  sharedModule.assert(result4[0] === sharedModule.account1.address, result4);

  const result5 = await quotaBank.getRequestAsync(sharedModule.account1.address);
  sharedModule.assert(Number.parseInt(result5.expirationHeight) > 0, result5.expirationHeight);
  sharedModule.assert(result5.note === "test 1234", result5.note);

  // avoid "general account's sendBlock.Height must be larger than 1"
  await sharedModule.fundAccount(sharedModule.account2);
  const result6 = await quotaBank.createRequestAsync(sharedModule.account2, "test2 1234");
  sharedModule.assert(result6.status === 0, result6.status.toString());

  const result7 = await quotaBank.getRequestorsAsync();
  sharedModule.assert(result7.length === 2, result7);
  sharedModule.assert(result7[0] === sharedModule.account1.address, result7);
  sharedModule.assert(result7[1] === sharedModule.account2.address, result7);

  await quotaBank.deleteRequestAsync(sharedModule.account0, sharedModule.account1.address);

  const result8 = await quotaBank.getRequestorsAsync();
  sharedModule.assert(result8.length === 1, result8);
  sharedModule.assert(result8[0] === sharedModule.account2.address, result8);
}

async function testCreateRequestSpam() {
  const contract = await deployModule.deployContractPath(contractPath2);
  const quotaBank = new QuotaBank(contract);

  const { logs, listener } = await createAddressListener(quotaBank.contract);

  await quotaBank.createRequestAsync(sharedModule.account1, "test 1", false);
  await quotaBank.createRequestAsync(sharedModule.account1, "test 2", false);
  await quotaBank.createRequestAsync(sharedModule.account1, "test 3", true);

  const requestResult1 = await quotaBank.getRequestAsync(sharedModule.account1.address);
  sharedModule.assert(Number.parseInt(requestResult1.expirationHeight) > 0, requestResult1.expirationHeight);
  sharedModule.assert(Number.parseInt(requestResult1.amount) == 0, requestResult1.amount);
  sharedModule.assert(requestResult1.note === "test 1", requestResult1.note);

  sharedModule.assert(logs.length === 1, logs);
}

async function testStakeRequestMock() {
  const contracts = await deployContracts();
  const quota = new QuotaMock(contracts.quota);
  const quotaBank = new QuotaBank(contracts.bank);

  const amount1 = sharedModule.toTokenAmount(100);
  const fundResult1 = await quotaBank.fundReservesAsync(sharedModule.account0, amount1);
  sharedModule.assert(fundResult1.status === 0, fundResult1);

  const reservesResult1 = await quotaBank.getReservesAsync();
  sharedModule.assert(reservesResult1 === amount1, reservesResult1);

  const { logs: quotaLogs, listener: quotaListener } = await createAddressListener(quota.contract);
  const { logs: bankLogs, listener: bankListener } = await createAddressListener(quotaBank.contract);

  // Should fail due to insufficient reserves
  const amount2 = sharedModule.toTokenAmount(101);
  const grantResult1 = await quotaBank.stakeRequestAsync(sharedModule.account0, sharedModule.account1.address, 1234, amount2);
  sharedModule.assert(grantResult1.status === 1, grantResult1.status.toString());

  const amount3 = sharedModule.toTokenAmount(10);
  const grantResult2 = await quotaBank.stakeRequestAsync(sharedModule.account0, sharedModule.account1.address, 1234, amount3);
  sharedModule.assert(grantResult2.status === 0, grantResult2.status.toString());

  const bankLog1 = await sharedModule.waitForNextVmLogEvent(bankListener, quotaBank.contract.abi);
  sharedModule.assert(bankLog1.event === 'DelegateStakeCallbackReceived', bankLog1);
  sharedModule.assert(bankLog1.args.successStr === 'false', bankLog1);

  const result1 = await quota.getLastStakeHeightAsync();
  sharedModule.assert(result1 === "0", result1);

  const grantResult3 = await quotaBank.stakeRequestAsync(sharedModule.account0, sharedModule.account1.address, constants.MIN_STAKE_HEIGHT, amount3);
  sharedModule.assert(grantResult3.status === 0, grantResult3.status.toString());

  const reservesResult2 = await quotaBank.getReservesAsync();
  sharedModule.assert(reservesResult2 === sharedModule.subtractBigNumbers(amount1, amount3), reservesResult2);

  const quotaLog1 = await sharedModule.waitForNextVmLogEvent(quotaListener, quota.contract.abi);
  sharedModule.assert(quotaLog1.event === 'StakeDelegated', quotaLog1);

  const bankLog2 = await sharedModule.waitForNextVmLogEvent(bankListener, quotaBank.contract.abi);
  sharedModule.assert(bankLog2.event === 'DelegateStakeCallbackReceived', bankLog2);
  sharedModule.assert(bankLog2.args.successStr === 'true', bankLog2);

  // await sharedModule.waitForNextBlocks();

  const result2 = await quota.getLastStakeHeightAsync();
  sharedModule.assert(result2 === constants.MIN_STAKE_HEIGHT.toString(), result2);

  const requestResult1 = await quotaBank.getRequestAsync(sharedModule.account1.address);
  sharedModule.assert(requestResult1.amount === amount3, requestResult1.amount);
  sharedModule.assert(parseInt(requestResult1.expirationHeight) > 0, requestResult1.expirationHeight);
}

async function testStakeRequest() {
  const contract = await deployModule.deployContractPath(contractPath2);
  const quota = new Quota();
  const quotaBank = new QuotaBank(contract);

  const amount1 = sharedModule.toTokenAmount(100);
  const fundResult1 = await quotaBank.fundReservesAsync(sharedModule.account0, amount1);
  sharedModule.assert(fundResult1.status === 0, fundResult1);

  const { logs, listener } = await createAddressListener(quotaBank.contract);

  const amount2 = sharedModule.toTokenAmount(10);
  const grantResult1 = await quotaBank.stakeRequestAsync(sharedModule.account0, sharedModule.account1.address, constants.MIN_STAKE_HEIGHT, amount2);
  sharedModule.assert(grantResult1.status === 0, grantResult1.status);

  const bankLog1 = await sharedModule.waitForNextVmLogEvent(listener, quotaBank.contract.abi);
  sharedModule.assert(bankLog1.event === 'DelegateStakeCallbackReceived', bankLog1);
}

async function main() {
  //await testOwner();
  await testQuotaContract();
  //await testFundAndWithdrawReserves();
  // await testCreateRequest1();
  // await testCreateRequest2();
  // await testCreateRequestSpam();
  // await testStakeRequestMock();
  //await testStakeRequest();
}

main().then(res => {
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(0);
});
