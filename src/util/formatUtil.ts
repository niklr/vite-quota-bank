import { AppConstants } from '../constants';
import { bigNumber } from './bigNumber';

export abstract class formatUtil {
  static formatQuota(quota: string): string {
    try {
      return bigNumber.toBasic(Number.parseInt(quota) / AppConstants.QuotaPerUT, 0, 3);
    } catch (error) {
      return "-1"
    }
  }

  static formatAmount(amount: string): string {
    try {
      return bigNumber.toBasic(Number.parseInt(amount), AppConstants.DefaultDecimals);
    } catch (error) {
      return "-1"
    }
  }
}