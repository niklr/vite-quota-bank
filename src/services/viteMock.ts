import { ViteService } from '.';

export class ViteMockService extends ViteService {
  async getQuotaRequests(): Promise<string[]> {
    return Promise.resolve(['hello'])
  }
}