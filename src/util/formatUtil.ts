import { AppConstants } from '../constants';
import { bigNumber } from './bigNumber';
import { commonUtil } from './commonUtil';

export abstract class formatUtil {
  static formatQuota(quota: string): string {
    try {
      const result = bigNumber.toBasic(Number.parseInt(quota) / AppConstants.QuotaPerUT, 0, 3)
      return commonUtil.isNullOrWhitespace(result) ? undefined : result;
    } catch (error) {
      return "-1"
    }
  }

  static formatAmount(amount: string): string {
    try {
      const result = bigNumber.toBasic(Number.parseInt(amount), AppConstants.DefaultDecimals);
      return commonUtil.isNullOrWhitespace(result) ? undefined : result;
    } catch (error) {
      return "-1"
    }
  }

  static formatSnackbarMessage(data: any): string {
    if (data) {
      let message: string
      if (commonUtil.isString(data)) {
        message = JSON.stringify(data)
      } else {
        message = data
      }
      if (data.length > 48) {
        return message.substr(0, 48) + "..."
      }
      return message
    }
    return "Something went wrong."
  }
}