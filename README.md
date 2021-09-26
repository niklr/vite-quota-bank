# VITE Quota Bank

Many blockchains solve the spamming problem with gas. Transactions on Vite, however, are free. To fight spamming, Vite transactions consume something called Quota. Quota can be secured by either locking VITE or running Proof-of-Work. When the Vite network is congested, locking VITE is required to secure Quota. At any time, the user can lock VITE to secure Quota for themselves or for another Vite address.

Users can lock their own VITE to secure Quota, or someone else can lock VITE to secure Quota on their behalf. For instance, if Alice doesn’t have enough VITE to lock up for getting sufficient Quota, she can ask Bob to lock his own VITE and set her address as a Quota beneficiary.

Video Walkthrough: [YouTube](https://www.youtube.com/watch?v=3pDNr3Qd60Y)

Live Demo: [https://niklr.github.io/vite-quota-bank/](https://niklr.github.io/vite-quota-bank/)

<h1 align="center">
	<img src="https://raw.githubusercontent.com/niklr/vite-quota-bank/main/assets/app.gif" alt="VITE Quota Bank">
</h1>

## ViteConnect integration

<h1 align="center">
	<img src="https://raw.githubusercontent.com/niklr/vite-quota-bank/main/assets/viteconnect.gif" alt="ViteConnect integration">
</h1>

## Features/requirements

- A frontend for Quota Bank, where users can apply for Quota (the Quota Bank can set its own standards for who would be eligible)
- Ability to lock VITE on behalf of said users
- Display the amount of VITE in reserve, to be used for locking
- A way to see which addresses received how much Quota
- The Quota Bank needs to set its own policies for expiration of locking support (e.g., Quota will only be provided to applicants for two weeks)

## Current limitations

This project was developed as part of the Gitcoin Grants Round 10 Hackathon taking place from Jun 16, 2021 to Jul 7, 2021. 
At that time the most recent version of `soliditypp` was `0.4.3` which has some limitations in terms of the feasability related to the submission requirements.

1. send() does not support sending tokens from one contract to another
2. contract binary size is limited to around ~11000 characters (compiled)

To overcome the mentioned limitations temporarily, the following measures have been applied/implemented:

- a mock contract to simulate and test the behaviour of the built-in `Quota` contract
- reduced the functionality of the `QuotaBank` contract to its bare minimum to showcase the PoC on `TestNet`
- a mock service on client-side to simulate and test the behaviour of functionalities currently missing by the `QuotaBank` contract

## Minimal setup

- Download [gvite](https://github.com/vitelabs/go-vite/releases/tag/v2.10.2)
- Copy content of `assets/gvite-v2.10.2.zip` into gvite folder
- Run `./gvite --config node_config_dev.json`
- Download [soliditypp](https://github.com/vitelabs/soliditypp-bin/releases/tag/v0.4.3) executable and modify `const solppc` in `scripts/deploy.js`
- Run `node ./scripts/init.js` to fund test accounts

## Deploy contract

1. Modify `./scripts/constants.js`
2. Run `node ./scripts/deploy_test.js`
3. Replace `BankContractAddress` in `app/src/constants.ts`
4. Replace `QuotaBank.json` in `app/public/assets/contracts`

## Test contracts

Test QuotaBank.solpp contract:

```bash
node ./scripts/quota_bank_test.js
```

Test QuotaMock.solpp contract:

```bash
node ./scripts/quota_mock_test.js
```