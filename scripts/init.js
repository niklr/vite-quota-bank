const { accountBlock } = require("@vite/vitejs");
const { sharedModule } = require('./shared');

const AccountBlock = accountBlock.AccountBlock;

// https://docs.vite.org/go-vite/tutorial/dappguide/testnode.html
// https://docs.vite.org/vite.js/wallet/more.html
// https://docs.vite.org/go-vite/tutorial/node/wallet-manage.html#recover-wallet-from-mnemonic

const genesisAccount = {
  address: 'vite_bb6ad02107a4422d6a324fd2e3707ad53cfed9359378a78792',
  privateKey: '7488b076b27aec48692230c88cbe904411007b71981057ea47d757c1e7f7ef24f4da4390a6e2618bec08053a86a6baf98830430cbefc078d978cf396e1c43e3a'
}

async function fundAccount(account, toAccount) {
  const myAccountBlock = new AccountBlock({
    blockType: 2,
    address: account.address,
    toAddress: toAccount.address,
    tokenId: 'tti_5649544520544f4b454e6e40',
    amount: '1000000000000000000000'
  });
  myAccountBlock.setProvider(sharedModule.provider).setPrivateKey(account.privateKey);

  const result1 = await myAccountBlock.autoSend();
  console.log(result1);

  await sharedModule.receiveAllOnroadTx(toAccount);
  const result2 = await sharedModule.provider.getBalanceInfo(toAccount.address);
  console.log(JSON.stringify(result2, undefined, 2));
}

async function main() {
  await fundAccount(genesisAccount, sharedModule.account0);
  await fundAccount(genesisAccount, sharedModule.account1);
  await fundAccount(genesisAccount, sharedModule.account2);
}

main()
  .then((res) => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(0);
  });
