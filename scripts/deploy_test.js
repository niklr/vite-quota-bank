const fs = require('fs');
const constants = require('./constants');
const { deployModule } = require('./deploy');
const { sharedModule } = require('./shared');
const QuotaBank = require('./quota_bank');

const contractPath1 = "./contracts/QuotaMock.solpp";
const contractPath2 = "./contracts/QuotaBank.solpp";

async function getContractInfo(address) {
  const quotaResult = await sharedModule.getQuotaByAddress(address);
  const balanceResult = await sharedModule.provider.getBalanceInfo(address);
  return {
    quota: quotaResult,
    balance: balanceResult.balance.balanceInfoMap[constants.VITE_TOKEN_ID].balance
  }
}

async function stakeForQuota(account, address, amount) {
  const result1 = await sharedModule.stakeForQuota(account, address, amount)
  const result2 = await sharedModule.waitForAccountBlock(account.address, result1.height);
  return result2
}

async function testBankDeploy(contract) {
  console.log('testBankDeploy')
  await deployModule.deployContractSource(contract);

  const result1 = await getContractInfo(contract.address);
  console.log(result1)
  sharedModule.assert(result1.balance === '0', result1.balance);
  sharedModule.assert(result1.quota.stakeAmount === '0', result1.quota.stakeAmount);

  return contract.address
}

async function testStake(address, amount) {
  console.log('testStake')
  const tokenAmount = sharedModule.toTokenAmount(amount);
  const result = await stakeForQuota(sharedModule.account0, address, tokenAmount)
  sharedModule.assert(result.status === 0, result);
}

async function testFund(contract, amount) {
  console.log('testFund')
  const quotaBank = new QuotaBank(contract);
  const tokenAmount = sharedModule.toTokenAmount(amount);
  const result = await quotaBank.fundReservesAsync(sharedModule.account0, tokenAmount);
  sharedModule.assert(result.status === 0, result);
}

async function testBalance(contract) {
  console.log('testBalance')
  await sharedModule.waitForNextBlocks();

  const contractInfo = await getContractInfo(contract.address);
  console.log(contractInfo)
  sharedModule.assert(contractInfo.balance !== '0', contractInfo.balance);
  sharedModule.assert(contractInfo.quota.stakeAmount !== '0', contractInfo.quota.stakeAmount);
}

async function testOwner(contract) {
  console.log('testOwner')
  const quotaBank = new QuotaBank(contract);
  const result = await quotaBank.getOwnerAsync();
  console.log(result)
  sharedModule.assert(result === sharedModule.account0.address, result);
}

async function main() {
  const path = contractPath2
  const contract = deployModule.compileSource(path);
  console.log(JSON.stringify(contract))
  fs.writeFileSync(path.replace('QuotaBank.solpp', 'QuotaBank.json'), JSON.stringify(contract, undefined, 2), 'utf8');

  // 1. Set shouldDeploy to true
  // 2. Run script
  // 3. Replace contract.address
  // 4. Set shouldDeploy to false
  // 5. Run script
  const shouldDeploy = false
  if (shouldDeploy) {
    await testBankDeploy(contract);
  } else {
    contract.address = 'vite_091e12441cc09f51bb84b7950c7a4a3c44b77442eccb789f7a';
    // Staking might not work right after deploying the contract -> out of quota
    await testStake(contract.address, 1000)
    await testFund(contract, 1);
    await testBalance(contract)
    await testOwner(contract)
  }
}

main().then(res => {
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(0);
});
