const execSync = require("child_process").execSync;
const os = require("os");
const { accountBlock } = require("@vite/vitejs");
const { sharedModule } = require('./shared');

const solppc = "/home/ubuntu/Programs/solppc";

function compileSource(contractPath) {
  let output;
  try {
    output = String(execSync(`${solppc} --bin --abi ${contractPath}`));
  } catch (err) {
    console.log("Compile failed: \n" + err.toString());
    return false;
  }

  let result = {};

  let lines = output.split(os.EOL);
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.startsWith("======= ")) {
      line = line.slice("======= ".length, -" =======".length).split(":")[1];
      result.contractName = line;
    } else if (line.startsWith("Binary:")) {
      i++;
      result.binary = lines[i];
    } else if (line.startsWith("OffChain Binary:")) {
      i++;
      result.offChain = lines[i];
    } else if (line.startsWith("Contract JSON ABI")) {
      i++;
      result.abi = JSON.parse(lines[i]);
    }
  }

  return result;
}

async function deploy(account, abi, binary) {
  // create a new contract
  let responseLatency = 1;
  let quotaMultiplier = 10;
  let randomDegree = 0;
  let block = accountBlock
    .createAccountBlock("createContract", {
      address: account.address,
      abi,
      code: binary,
      responseLatency,
      params: [],
      quotaMultiplier,
      randomDegree
    })
    .setProvider(sharedModule.provider)
    .setPrivateKey(account.privateKey);

  await block.autoSetPreviousAccountBlock();
  const result = await block.sign().send();

  // let createContractBlock = await sharedModule.provider.request(
  //   'ledger_getBlockByHeight',
  //   account.address,
  //   result.height
  // );
  // console.log(createContractBlock);

  console.log("Smart contract %s deployed!", result.toAddress);

  return result;
}

async function deployContractPath(path) {
  const contract = compileSource(path);
  console.log(JSON.stringify(contract));

  await deployContractSource(contract)

  return contract;
}

async function deployContractSource(contract) {
  const account = sharedModule.account0;
  const deployed = await deploy(account, contract.abi, contract.binary);
  contract.address = deployed.toAddress;
  
  // Waiting just for the next block is not sufficient -> constructor might not be called.
  await sharedModule.waitForAccountBlock(account.address, deployed.height);
}

module.exports = {
  deployModule: {
    compileSource: compileSource,
    deploy: deploy,
    deployContractPath: deployContractPath,
    deployContractSource: deployContractSource
  } 
}