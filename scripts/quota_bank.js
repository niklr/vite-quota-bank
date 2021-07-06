const { sharedModule } = require('./shared');

class QuotaBank {
  _contract
  _getOwnerAbi
  _getQuotaContractAbi
  _getReservesAbi
  _getRequestorsAbi
  _getRequestAbi

  constructor(contract) {
    this._contract = contract;
    this._getOwnerAbi = contract.abi.find(e => e.type === "offchain" && e.name === "getOwner");
    this._getQuotaContractAbi = contract.abi.find(e => e.type === "offchain" && e.name === "getQuotaContract");
    this._getReservesAbi = contract.abi.find(e => e.type === "offchain" && e.name === "getReserves");
    this._getRequestorsAbi = contract.abi.find(e => e.type === "offchain" && e.name === "getRequestors");
    this._getRequestAbi = contract.abi.find(e => e.type === "offchain" && e.name === "getRequest");

    return this;
  }

  get contract() {
    return this._contract;
  }

  objectFromEntries = (entries) => {
    return Object.fromEntries(
      entries.map((entry) => {
        return [entry.name, entry.value];
      })
    );
  };

  async getOwnerAsync() {
    console.log('getOwnerAsync');
    const result = await sharedModule.callOffChainMethod(this._contract.address, this._getOwnerAbi, this._contract.offChain, []);
    return result[0].value;
  }

  async getQuotaContractAsync() {
    console.log('getQuotaContractAsync');
    const result = await sharedModule.callOffChainMethod(this._contract.address, this._getQuotaContractAbi, this._contract.offChain, []);
    return result[0].value;
  }

  async getReservesAsync() {
    console.log('getReservesAsync');
    const result = await sharedModule.callOffChainMethod(this._contract.address, this._getReservesAbi, this._contract.offChain, []);
    return result[0].value;
  }

  async getRequestorsAsync() {
    console.log('getRequestorsAsync');
    const result = await sharedModule.callOffChainMethod(this._contract.address, this._getRequestorsAbi, this._contract.offChain, []);
    return result[0].value;
  }

  async getRequestAsync(address) {
    console.log('getRequestAsync');
    const result = await sharedModule.callOffChainMethod(this._contract.address, this._getRequestAbi, this._contract.offChain, [address]);
    return this.objectFromEntries(result);
  }

  async setQuotaContractAsync(account, address) {
    console.log('setQuotaContractAsync', account);
    const result1 = await sharedModule.callContract(account, 'SetQuotaContract', this._contract.abi, [address], '0', this._contract.address);
    const result2 = await sharedModule.waitForAccountBlock(account.address, result1.height);
    return result2;
  }

  async fundReservesAsync(account, amount) {
    console.log('fundReservesAsync', account, amount);
    const result1 = await sharedModule.callContract(account, 'FundReserves', this._contract.abi, [], amount, this._contract.address);
    const result2 = await sharedModule.waitForAccountBlock(account.address, result1.height);
    return result2;
  }

  async withdrawReservesAsync(account) {
    console.log('withdrawReservesAsync', account);
    const result1 = await sharedModule.callContract(account, 'WithdrawReserves', this._contract.abi, [], '0', this._contract.address);
    const result2 = await sharedModule.waitForAccountBlock(account.address, result1.height);
    return result2;
  }

  async createRequestAsync(account, note, wait = true) {
    console.log('createRequestAsync', account, note);
    const result1 = await sharedModule.callContract(account, 'CreateRequest', this._contract.abi, [note], '0', this._contract.address);
    if (wait) {
      const result2 = await sharedModule.waitForAccountBlock(account.address, result1.height);
      return result2;    
    } else {
      return result1;
    }
  }

  async stakeRequestAsync(account, addr, stakeHeight, amount) {
    console.log('stakeRequestAsync', account, addr, stakeHeight, amount);
    const result1 = await sharedModule.callContract(account, 'StakeRequest', this._contract.abi, [addr, stakeHeight, amount], '0', this._contract.address);
    const result2 = await sharedModule.waitForAccountBlock(account.address, result1.height);
    return result2;   
  }

  async deleteRequestAsync(account, addr) {
    console.log('deleteRequestAsync', account, addr);
    const result1 = await sharedModule.callContract(account, 'DeleteRequest', this._contract.abi, [addr], '0', this._contract.address);
    const result2 = await sharedModule.waitForAccountBlock(account.address, result1.height);
    return result2;    
  }
}

module.exports = QuotaBank;