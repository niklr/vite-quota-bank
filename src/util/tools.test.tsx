import { truncateStringInTheMiddle as truncate } from './tools';

describe('truncateStringInTheMiddle', () => {
  it('should not change string with truncate positions great or equal than string length', () => {
    expect(truncate('foobar', 4, 2)).toBe('foobar')
    expect(truncate('foobar', 6, 6)).toBe('foobar')
  })

  it('should truncate string with three dots in the middle', () => {
    expect(truncate('foobarbaz', 3, 2)).toBe('foo...az')
    expect(truncate('foobarbaz', 1, 1)).toBe('f...z')
  })
})