const constants = require('./constants');
const { sharedModule } = require('./shared');

class Quota {
  _contract

  // https://github.com/vitelabs/go-vite/blob/master/vm/contracts/abi/abi_quota.go
  constructor() {
    this._contract = {
      binary: '',
      abi: JSON.parse(`
      [
        {"type":"function","name":"Pledge", "inputs":[{"name":"beneficiary","type":"address"}]},
        {"type":"function","name":"Stake", "inputs":[{"name":"beneficiary","type":"address"}]},
        {"type":"function","name":"StakeForQuota", "inputs":[{"name":"beneficiary","type":"address"}]},
        {"type":"function","name":"CancelPledge","inputs":[{"name":"beneficiary","type":"address"},{"name":"amount","type":"uint256"}]},
        {"type":"function","name":"CancelStake","inputs":[{"name":"beneficiary","type":"address"},{"name":"amount","type":"uint256"}]},
        {"type":"function","name":"CancelQuotaStaking","inputs":[{"name":"id","type":"bytes32"}]},
        {"type":"function","name":"AgentPledge", "inputs":[{"name":"stakeAddress","type":"address"},{"name":"beneficiary","type":"address"},{"name":"bid","type":"uint8"},{"name":"stakeHeight","type":"uint64"}]},
        {"type":"function","name":"DelegateStake", "inputs":[{"name":"stakeAddress","type":"address"},{"name":"beneficiary","type":"address"},{"name":"bid","type":"uint8"},{"name":"stakeHeight","type":"uint64"}]},
        {"type":"function","name":"StakeForQuotaWithCallback", "inputs":[{"name":"beneficiary","type":"address"},{"name":"stakeHeight","type":"uint64"}]},	
        {"type":"function","name":"AgentCancelPledge","inputs":[{"name":"stakeAddress","type":"address"},{"name":"beneficiary","type":"address"},{"name":"amount","type":"uint256"},{"name":"bid","type":"uint8"}]},
        {"type":"function","name":"CancelDelegateStake","inputs":[{"name":"stakeAddress","type":"address"},{"name":"beneficiary","type":"address"},{"name":"amount","type":"uint256"},{"name":"bid","type":"uint8"}]},
        {"type":"function","name":"CancelQuotaStakingWithCallback","inputs":[{"name":"id","type":"bytes32"}]},
        {"type":"callback","name":"AgentPledge","inputs":[{"name":"stakeAddress","type":"address"},{"name":"beneficiary","type":"address"},{"name":"amount","type":"uint256"},{"name":"bid","type":"uint8"},{"name":"success","type":"bool"}]},
        {"type":"callback","name":"DelegateStake","inputs":[{"name":"stakeAddress","type":"address"},{"name":"beneficiary","type":"address"},{"name":"amount","type":"uint256"},{"name":"bid","type":"uint8"},{"name":"success","type":"bool"}]},
        {"type":"callback","name":"StakeForQuotaWithCallback", "inputs":[{"name":"id","type":"bytes32"},{"name":"success","type":"bool"}]},	
        {"type":"callback","name":"AgentCancelPledge","inputs":[{"name":"stakeAddress","type":"address"},{"name":"beneficiary","type":"address"},{"name":"amount","type":"uint256"},{"name":"bid","type":"uint8"},{"name":"success","type":"bool"}]},
        {"type":"callback","name":"CancelDelegateStake","inputs":[{"name":"stakeAddress","type":"address"},{"name":"beneficiary","type":"address"},{"name":"amount","type":"uint256"},{"name":"bid","type":"uint8"},{"name":"success","type":"bool"}]},
        {"type":"callback","name":"CancelQuotaStakingWithCallback","inputs":[{"name":"id","type":"bytes32"},{"name":"success","type":"bool"}]},
        {"type":"variable","name":"stakeInfo","inputs":[{"name":"amount","type":"uint256"},{"name":"expirationHeight","type":"uint64"},{"name":"beneficiary","type":"address"},{"name":"isDelegated","type":"bool"},{"name":"delegateAddress","type":"address"},{"name":"bid","type":"uint8"}]},
        {"type":"variable","name":"stakeInfoV2","inputs":[{"name":"amount","type":"uint256"},{"name":"expirationHeight","type":"uint64"},{"name":"beneficiary","type":"address"},{"name":"id","type":"bytes32"}]},
        {"type":"variable","name":"stakeBeneficial","inputs":[{"name":"amount","type":"uint256"}]}
      ]`),
      offChain: '',
      address: constants.QUOTA_CONTRACT_ADDR,
    }
  }

  get contract() {
    return this._contract;
  }

  async stakeForQuota(account, beneficiary, amount) {
    console.log('stakeForQuota', account, beneficiary, amount);
    const result1 = await sharedModule.callContract(account, 'StakeForQuota', this._contract.abi, [beneficiary], amount, this._contract.address);
    const result2 = await sharedModule.waitForAccountBlock(account.address, result1.height);
    return result2;
  }

  async cancelStake(account, beneficiary, amount) {
    console.log('cancelStake', account, beneficiary, amount);
    const result1 = await sharedModule.callContract(account, 'CancelStake', this._contract.abi, [beneficiary, amount], '0', this._contract.address);
    const result2 = await sharedModule.waitForAccountBlock(account.address, result1.height);
    return result2;
  }
}

module.exports = Quota;