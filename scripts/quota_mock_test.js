const constants = require('./constants');
const { deployModule } = require('./deploy');
const QuotaMock = require('./quota_mock');
const { sharedModule } = require('./shared');

const contractPath = "./contracts/QuotaMock.solpp";

async function testDelegateStake() {
  const contract = await deployModule.deployContractPath(contractPath);
  const quota = new QuotaMock(contract);

  const vmLogs = [];
  const quotaListener = await sharedModule.createAddressListener(contract.address);
  quotaListener.on((results) => {
    for (let index = 0; index < results.length; index++) {
      const result = results[index];
      console.log(result);
      const vmLog = sharedModule.decodeVmLog(result.vmlog, contract.abi);
      vmLogs.push(vmLog);
    }
  });

  const result1 = await quota.getLastStakeHeightAsync();
  sharedModule.assert(result1 === "0", result1);

  const delegateResult1 = await quota.delegateStakeAsync(sharedModule.account0, sharedModule.account0.address, sharedModule.account1.address, 0, 0);
  sharedModule.assert(delegateResult1.status === 0, delegateResult1.status);

  const result2 = await quota.getLastStakeHeightAsync();
  sharedModule.assert(result2 === "0", result2);
  sharedModule.assert(vmLogs.length === 1, vmLogs.length.toString());

  const delegateResult2 = await quota.delegateStakeAsync(sharedModule.account0, sharedModule.account0.address, sharedModule.account1.address, 0, constants.MIN_STAKE_HEIGHT);
  sharedModule.assert(delegateResult2.status === 0, delegateResult2.status);

  const result3 = await quota.getLastStakeHeightAsync();
  sharedModule.assert(result3 === constants.MIN_STAKE_HEIGHT.toString(), result3);
  sharedModule.assert(vmLogs.length === 2, vmLogs.length.toString());

  console.log(vmLogs);
}

async function main() {
  await testDelegateStake();
}

main().then(res => {
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(0);
});
