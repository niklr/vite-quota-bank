export class Account {
  id?: string
  privateKey?: string
  address?: string

  constructor(init?: Partial<Account>) {
    this.init(init)
  }

  init(data?: any): void {
    if (data) {
      this.id = data.id
      this.privateKey = data.privateKey
      this.address = data.address
    }
  }
}

export class AccountContainer {
  active?: Account
  mnemonic?: string
  accounts: string[] = [];

  constructor(init?: Partial<AccountContainer>) {
    this.init(init)
    if (!this.accounts) {
      this.accounts = []
    }
  }

  init(data?: any): void {
    if (data) {
      this.active = data.active ? new Account(data.active) : undefined
      this.mnemonic = data.mnemonic
      this.accounts = Array.isArray(data.accounts) ? [...data.accounts] : []
    }
  }
}