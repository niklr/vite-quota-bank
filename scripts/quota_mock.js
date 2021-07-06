const { sharedModule } = require('./shared');

class QuotaMock {
  _contract
  _getLastStakeHeight

  constructor(contract) {
    this._contract = contract;
    this._getLastStakeHeight = contract.abi.find(e => e.type === "offchain" && e.name === "getLastStakeHeight");

    return this;
  }

  get contract() {
    return this._contract;
  }

  async getLastStakeHeightAsync() {
    console.log('getLastStakeHeightAsync');
    const result = await sharedModule.callOffChainMethod(this._contract.address, this._getLastStakeHeight, this._contract.offChain, []);
    return result[0].value;
  }

  async delegateStakeAsync(account, stakeAddress, beneficiary, bid, stakeHeight) {
    console.log('delegateStakeAsync', account, stakeAddress, beneficiary, bid, stakeHeight);
    const result1 = await sharedModule.callContract(account, 'DelegateStake', this._contract.abi, [stakeAddress, beneficiary, bid, stakeHeight], '0', this._contract.address);
    const result2 = await sharedModule.waitForAccountBlock(account.address, result1.height);
    return result2;
  }
}

module.exports = QuotaMock;