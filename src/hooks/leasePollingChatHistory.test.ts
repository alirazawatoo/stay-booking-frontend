import { isAnalysisSettled } from './leasePollingChatHistory'

const uploadedAt = '2026-10-09 15:40:00.000000+00:00'
const uploadTime = Date.UTC(2026, 9, 9, 15, 40)
const pending = { document_uploaded_at: uploadedAt, gpt_response: { message: null, status: null, timestamp: null }, chat_history: [] }

describe('isAnalysisSettled', () => {
  it('keeps polling while the analysis is pending and recent', () => {
    expect(isAnalysisSettled(pending, uploadTime + 60_000)).toBe(false)
    expect(isAnalysisSettled(undefined, uploadTime)).toBe(false)
  })

  it('stops once the analysis reports a status', () => {
    expect(isAnalysisSettled({ ...pending, gpt_response: { message: 'ok', status: 'Approved', timestamp: null } }, uploadTime)).toBe(true)
  })

  it('stops 20 minutes after upload even without a result', () => {
    expect(isAnalysisSettled(pending, uploadTime + 21 * 60_000)).toBe(true)
  })
})
