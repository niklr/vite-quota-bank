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

  static isExpired(expirationHeight?: string, blockHeight?: string): boolean {
    if (expirationHeight && blockHeight) {
      return bigNumber.compared(blockHeight, expirationHeight) === 1
    }
    return false
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