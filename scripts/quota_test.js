const constants = require('./constants');
const Quota = require('./quota');
const { sharedModule } = require('./shared');

function stringify(data) {
  return JSON.stringify(data, undefined, 2);
}

async function getAccountInfo(account) {
  await sharedModule.receiveAllOnroadTx(account);
  const quotaResult = await sharedModule.getQuotaByAddress(account.address);
  const balanceResult = await sharedModule.provider.getBalanceInfo(account.address);
  return {
    address: account.address,
    quota: quotaResult,
    balance: balanceResult.balance.balanceInfoMap[constants.VITE_TOKEN_ID].balance
  }
}

async function testStakeForQuota() {
  const quota = new Quota();

  // const cancelResult1 = await quota.cancelStake(sharedModule.account0, sharedModule.account1.address, sharedModule.toTokenAmount(1200));
  // sharedModule.assert(cancelResult1.status === 0, cancelResult1);

  const accountResult1 = await getAccountInfo(sharedModule.account0);
  console.log(stringify(accountResult1));

  const accountResult2 = await getAccountInfo(sharedModule.account1);
  console.log(stringify(accountResult2));

  const amount = sharedModule.toTokenAmount(200);
  const result1 = await quota.stakeForQuota(sharedModule.account0, sharedModule.account1.address, amount);
  sharedModule.assert(result1.status === 0, result1);

  await sharedModule.waitForNextBlocks();

  const accountResult3 = await getAccountInfo(sharedModule.account1);
  console.log(stringify(accountResult3));
  sharedModule.assert(accountResult3.quota.stakeAmount === sharedModule.addBigNumbers(accountResult2.quota.stakeAmount, amount), accountResult3.quota.stakeAmount);
}

async function main() {
  await testStakeForQuota();
}

main().then(res => {
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(0);
});
