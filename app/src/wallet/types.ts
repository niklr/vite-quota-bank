export enum WalletType {
  Web = 'Web',
  Session = 'Session'
}

export abstract class Wallet<T> {
  type!: WalletType
  active?: T
  accounts: T[] = []

  constructor(type: WalletType, init?: Partial<Wallet<T>>) {
    this.type = type
    this.init(init)
  }

  static fromJS(data: any): Maybe<WebWallet | SessionWallet> {
    data = typeof data === 'object' ? data : {}
    switch (data.type) {
      case WalletType.Web:
        return new WebWallet(data)
      case WalletType.Session:
        return new SessionWallet(data)
      default:
        break
    }
    return undefined
  }

  abstract createAccount(data: any): T

  protected init(data: any): void {
    this.active = data.active ? this.createAccount(data.active) : undefined
    if (data.accounts && Array.isArray(data.accounts)) {
      data.accounts.forEach((account: any) => {
        this.accounts.push(this.createAccount(account))
      })
    }
    if (!this.accounts) {
      this.accounts = []
    }
  }
}

export class WebWallet extends Wallet<WebWalletAccount> {
  mnemonic!: string

  constructor(init?: Partial<WebWallet>) {
    super(WalletType.Web, init)
  }

  init(data?: any): void {
    super.init(data)
    if (data) {
      this.mnemonic = data.mnemonic
    }
  }

  createAccount(data: any): WebWalletAccount {
    return new WebWalletAccount(data)
  }
}

export class SessionWallet extends Wallet<SessionWalletAccount> {
  session!: string
  timestamp!: number

  constructor(init?: Partial<SessionWallet>) {
    super(WalletType.Session, init)
  }

  init(data?: any): void {
    super.init(data)
    if (data) {
      this.session = data.session
      this.timestamp = data.timestamp
    }
  }

  createAccount(data: any): SessionWalletAccount {
    return new SessionWalletAccount(data)
  }
}

export enum WalletAccountType {
  Web = 'Web',
  Session = 'Session'
}

export abstract class WalletAccount {
  id!: string
  type!: WalletAccountType
  address!: string

  constructor(type: WalletAccountType, init?: Partial<WalletAccount>) {
    this.type = type
    this.init(init)
  }

  static fromJS(data: any): Maybe<WalletAccount> {
    data = typeof data === 'object' ? data : {}
    switch (data.type) {
      case WalletType.Web:
        return new WebWalletAccount(data)
      case WalletType.Session:
        return new SessionWalletAccount(data)
      default:
        break
    }
    return undefined
  }

  protected init(data?: any): void {
    if (data) {
      this.id = data.id
      this.address = data.address
    }
  }
}

export class WebWalletAccount extends WalletAccount {
  privateKey!: string

  constructor(init?: Partial<WebWalletAccount>) {
    super(WalletAccountType.Web, init)
    this.init(init)
  }

  init(data?: any): void {
    super.init(data)
    if (data) {
      this.privateKey = data.privateKey
    }
  }
}

export class SessionWalletAccount extends WalletAccount {
  constructor(init?: Partial<SessionWalletAccount>) {
    super(WalletAccountType.Session, init)
  }
}