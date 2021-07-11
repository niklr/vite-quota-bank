export enum WalletType {
  Web = 'Web',
  Session = 'Session'
}

export abstract class Wallet<T> {
  private readonly _type: WalletType

  active?: T
  accounts: T[] = []

  constructor(type: WalletType, init?: Partial<Wallet<T>>) {
    this._type = type
    this.baseInitinit(init)
  }

  static fromJS(data: any): Maybe<WebWallet | SessionWallet> {
    data = typeof data === 'object' ? data : {}
    switch (data._type) {
      case WalletType.Web:
        return new WebWallet(data)
      case WalletType.Session:
        return new SessionWallet(data)
      default:
        break
    }
    return undefined
  }

  get type(): WalletType {
    return this._type
  }

  protected abstract createAccount(data: any): T

  private baseInitinit(data?: any): void {
    if (data) {
      this.active = data.active ? this.createAccount(data.active) : undefined
      if (data.accounts && Array.isArray(data.accounts)) {
        data.accounts.forEach((account: any) => {
          this.accounts.push(this.createAccount(account))
        })
      }
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
    this.init(init)
  }

  init(data?: any): void {
    if (data) {
      this.mnemonic = data.mnemonic
    }
  }

  protected createAccount(data: any): WebWalletAccount {
    return new WebWalletAccount(data)
  }
}

export class SessionWallet extends Wallet<SessionWalletAccount> {
  session!: string
  timestamp!: number

  constructor(init?: Partial<SessionWallet>) {
    super(WalletType.Session, init)
    this.init(init)
  }

  init(data?: any): void {
    if (data) {
      this.session = data.session
      this.timestamp = data.timestamp
    }
  }

  protected createAccount(data: any): SessionWalletAccount {
    return new SessionWalletAccount(data)
  }
}

export enum WalletAccountType {
  Web = 'Web',
  Session = 'Session'
}

export abstract class WalletAccount {
  private readonly _type: WalletAccountType

  id!: string
  address!: string

  constructor(type: WalletAccountType, init?: Partial<WalletAccount>) {
    this._type = type
    this.baseInit(init)
  }

  static fromJS(data: any): Maybe<WalletAccount> {
    data = typeof data === 'object' ? data : {}
    switch (data._type) {
      case WalletType.Web:
        return new WebWalletAccount(data)
      case WalletType.Session:
        return new SessionWalletAccount(data)
      default:
        break
    }
    return undefined
  }

  get type(): WalletAccountType {
    return this._type
  }

  private baseInit(data?: any): void {
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