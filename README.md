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