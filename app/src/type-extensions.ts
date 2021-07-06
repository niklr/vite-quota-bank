import { AppConstants } from './constants';
import { QuotaRequest } from './types';
import { bigNumber } from './util/bigNumber';
import { commonUtil } from './util/commonUtil';
import { momentUtil } from './util/momentUtil';

export class QuotaRequestExtensions {
  private static instance: QuotaRequestExtensions
  private moment: momentUtil

  private constructor() {
    this.moment = new momentUtil()
  }

  public static getInstance(): QuotaRequestExtensions {
    if (!QuotaRequestExtensions.instance) {
      QuotaRequestExtensions.instance = new QuotaRequestExtensions()
    }

    return QuotaRequestExtensions.instance
  }

  update(quotaRequet?: QuotaRequest, blockHeight?: string): void {
    if (quotaRequet?.expirationHeight) {
      quotaRequet.isExpired = commonUtil.isExpired(quotaRequet.expirationHeight, blockHeight)
      if (!quotaRequet.expirationDate && blockHeight && blockHeight !== AppConstants.InitialNetworkBlockHeight) {
        const secondsDiff = Number.parseInt(bigNumber.minus(quotaRequet.expirationHeight, blockHeight))
        quotaRequet.expirationDate = this.moment.get().add(secondsDiff, 's').toDate()
        quotaRequet.expirationDateFormatted = this.moment.getLocalReverseFormatted(quotaRequet.expirationDate)
      }
      quotaRequet.status = "Unknown"
      if (quotaRequet.isExpired) {
        quotaRequet.status = "Expired"
      } else {
        if (quotaRequet.amount) {
          quotaRequet.status = "Active"
        } else {
          quotaRequet.status = "Pending"
        }
      }
    }
  }
}