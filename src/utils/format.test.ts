import { formatAddress, formatCount, formatCurrency } from './format'
import { formatLocalDate } from './dates'

describe('display formatters', () => {
  it('keeps zero values and marks missing ones', () => {
    expect(formatCurrency(0)).toBe('$0')
    expect(formatCurrency(1850)).toBe('$1,850')
    expect(formatCurrency(-120)).toBe('-$120')
    expect(formatCurrency(null)).toBe('N/A')
    expect(formatCount(0)).toBe('0')
    expect(formatCount(undefined)).toBe('N/A')
  })

  it('omits an empty second address line', () => {
    expect(formatAddress('12 Harbour Row', null)).toBe('12 Harbour Row')
    expect(formatAddress('12 Harbour Row', 'Unit 4')).toBe('12 Harbour Row, Unit 4')
  })

  it('formats the picked calendar day without a UTC shift', () => {
    expect(formatLocalDate(new Date(2026, 0, 31, 23, 30))).toBe('2026-01-31')
    expect(formatLocalDate(new Date(2026, 4, 1, 0, 5))).toBe('2026-05-01')
  })
})
