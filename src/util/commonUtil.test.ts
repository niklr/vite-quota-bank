import { commonUtil } from './commonUtil'

describe('truncateStringInTheMiddle', () => {
  it('should not change string with truncate positions great or equal than string length', () => {
    expect(commonUtil.truncateStringInTheMiddle('foobar', 4, 2)).toBe('foobar')
    expect(commonUtil.truncateStringInTheMiddle('foobar', 6, 6)).toBe('foobar')
  })

  it('should truncate string with three dots in the middle', () => {
    expect(commonUtil.truncateStringInTheMiddle('foobarbaz', 3, 2)).toBe('foo...az')
    expect(commonUtil.truncateStringInTheMiddle('foobarbaz', 1, 1)).toBe('f...z')
  })
})