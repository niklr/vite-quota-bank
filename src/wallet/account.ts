export class Account {
  id!: string
  privateKey!: string
  address!: string

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