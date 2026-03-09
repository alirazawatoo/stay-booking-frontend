import { parseServerTimestamp } from './dates'

describe('parseServerTimestamp', () => {
  it('parses the str(datetime) form returned for document_uploaded_at', () => {
    expect(parseServerTimestamp('2026-03-14 09:30:00.123456+00:00')).toBe(Date.UTC(2026, 2, 14, 9, 30, 0, 123))
  })

  it('returns null for missing or unparseable values', () => {
    expect(parseServerTimestamp(undefined)).toBeNull()
    expect(parseServerTimestamp('not a date')).toBeNull()
  })
})
