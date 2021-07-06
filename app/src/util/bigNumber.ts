import BigNumber from 'bignumber.js';

const groupFormat = {
  decimalSeparator: '.',
  groupSeparator: ',',
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: ' ',
  fractionGroupSize: 0
};
const normalFormat = {
  decimalSeparator: '.',
  groupSeparator: '',
  groupSize: 0,
  secondaryGroupSize: 0,
  fractionGroupSeparator: '',
  fractionGroupSize: 0
};

const normalConfig = {
  FORMAT: normalFormat,
  ROUNDING_MODE: BigNumber.ROUND_DOWN
};

const groupConfig = {
  FORMAT: groupFormat,
  ROUNDING_MODE: BigNumber.ROUND_DOWN
};

const ceilConfig = {
  FORMAT: normalFormat,
  ROUNDING_MODE: BigNumber.ROUND_CEIL
};

BigNumber.config(normalConfig);
const GroupBigNumber = BigNumber.clone(groupConfig);
const CeilBigNumber = BigNumber.clone(ceilConfig);

const DP = 8;

export abstract class bigNumber {
  static compared(x: any, y: any) {
    x = new BigNumber(x);
    y = new BigNumber(y);
    return x.comparedTo(y);
  }
  static isEqual(num1: any, num2: any) {
    num1 = new BigNumber(num1);
    num2 = new BigNumber(num2);
    return num1.isEqualTo(num2);
  }
  static minus(x: any, y: any, fix = 8, type = 'fix') {
    x = new BigNumber(x);
    y = new BigNumber(y);
    const result = x.minus(y);
    return type === 'fix' ? result.toFormat(fix) : result.decimalPlaces(fix, 1).toFormat();
  }
  static plus(x: any, y: any, fix = 8, type = 'fix') {
    x = new BigNumber(x);
    y = new BigNumber(y);
    const result = x.plus(y);
    return type === 'fix' ? result.toFormat(fix) : result.decimalPlaces(fix, 1).toFormat();
  }
  static multi(x: any, y: any, fix = 8) {
    x = new BigNumber(x);
    y = new BigNumber(y);
    return x.multipliedBy(y).toFormat(fix);
  }
  static dividedToNumber(num1: any, num2: any, fix = 0, type = 'fix') {
    num1 = new BigNumber(num1);
    num2 = new BigNumber(num2);
    if (fix === 0) {
      return num1.dividedBy(num2).integerValue().toString();
    }

    const result = num1.dividedBy(num2);
    return type === 'fix' ? result.toFormat(fix) : result.decimalPlaces(fix, 1).toFormat();
  }
  static dividedCeil(num1: any, num2: any, fix = 0) {
    num1 = new CeilBigNumber(num1);
    num2 = new CeilBigNumber(num2);
    const result = num1.dividedBy(num2);
    return result.toFormat(fix);
  }
  static toBasic(num: any, minUnit = 0, decimalPlaces = DP) {
    const min = new BigNumber(10).exponentiatedBy(minUnit);
    num = new BigNumber(num);
    if (num.c === null) {
      return '';
    }

    try {
      return num.dividedBy(min).decimalPlaces(decimalPlaces, 1).toFormat();
    } catch (err) {
      return '';
    }
  }
  static exponentiated(num: any, unit: any, offset = 0) {
    const number = new BigNumber(num).exponentiatedBy(unit);
    const offsetNum = new BigNumber(offset);
    const result = number.plus(offsetNum);
    return result.toFormat();
  }
  static toMin(num: any, minUnit: any) {
    const min = new BigNumber(10).exponentiatedBy(minUnit);
    num = new BigNumber(num);
    if (num.c === null) {
      return '';
    }

    try {
      return num.multipliedBy(min).toFormat();
    } catch (err) {
      return '';
    }
  }
  static formatNum(num: any, decimal = 8, fix = 8) {
    decimal = decimal >= fix ? fix : decimal;
    const n = new GroupBigNumber(num);
    return n.toFormat(decimal);
  }
  static normalFormatNum(num: any, decimal = 8, fix = 8) {
    decimal = decimal >= fix ? fix : decimal;
    const n = new BigNumber(num);
    return n.toFormat(decimal);
  }
  static onlyFormat(num: any, minDecimals: any) {
    const n = new GroupBigNumber(num);
    let formatN = n.toFormat();

    if (typeof minDecimals === 'undefined') {
      return formatN;
    }

    const afterPoint = formatN.split('.')[1] || '';
    if (afterPoint.length >= minDecimals) {
      return formatN;
    }

    if (!afterPoint.length) {
      formatN += '.';
    }
    for (let i = 0; i < minDecimals - afterPoint.length; i++) {
      formatN += '0';
    }
    return formatN;
  }
};
