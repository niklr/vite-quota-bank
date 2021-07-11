import { bigNumber } from './bigNumber';

export abstract class commonUtil {
  static isString(value: any): boolean {
    return typeof value === 'string' || value instanceof String;
  }

  static isNullOrWhitespace(value?: string): boolean {
    if (!commonUtil.isString(value)) {
      // console.log('Expected a string but got: ', value);
      return true;
    } else {
      return value === null || value === undefined || value.trim() === '';
    }
  }

  static isNullOrDefault(value?: string, defaultValue?: string): boolean {
    return commonUtil.isNullOrWhitespace(value) || value === defaultValue
  }

  static isExpired(expirationHeight?: string, blockHeight?: string): boolean {
    if (expirationHeight && blockHeight) {
      return bigNumber.compared(blockHeight, expirationHeight) === 1
    }
    return false
  }

  static timeout(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static truncateString = (str: Maybe<string>, maxLength: number) => {
    if (str) {
      if (maxLength < str.length) {
        return `${str.substr(0, maxLength)}...`
      }
    }
    return str
  }

  static truncateStringInTheMiddle = (str: Maybe<string>, strPositionStart: number, strPositionEnd: number) => {
    if (str) {
      const minTruncatedLength = strPositionStart + strPositionEnd
      if (minTruncatedLength < str.length) {
        return `${str.substr(0, strPositionStart)}...${str.substr(str.length - strPositionEnd, str.length)}`
      }
    }
    return str
  }
}