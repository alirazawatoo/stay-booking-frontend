import { api, useGetChatHistoryQuery } from '@/services/api';
import type { ChatHistoryResponse } from '@/types/chatTypes';
import { parseServerTimestamp } from '@/utils/dates';

const POLL_INTERVAL_MS = 3000;
const ANALYSIS_POLL_WINDOW_MS = 20 * 60 * 1000;

// The initial analysis runs in a background task. It is settled once it reports a
// status other than Pending, or 20 minutes after upload so a lost task cannot poll
// forever. `checkedAt` is when the response arrived, which keeps this pure.
export function isAnalysisSettled(history: ChatHistoryResponse | undefined, checkedAt: number | undefined): boolean {
  if (!history) return false;
  const status = history.gpt_response?.status;
  if (status && status !== 'Pending') return true;
  const uploadedAt = parseServerTimestamp(history.document_uploaded_at);
  return uploadedAt !== null && checkedAt !== undefined && checkedAt - uploadedAt > ANALYSIS_POLL_WINDOW_MS;
}

const usePollingChatHistory = (documentId: string | undefined) => {
  const { data: cached, fulfilledTimeStamp } = api.endpoints.getChatHistory.useQueryState(documentId, { skip: !documentId });
  const analysisSettled = isAnalysisSettled(cached as ChatHistoryResponse | undefined, fulfilledTimeStamp);
  const { data, error, refetch } = useGetChatHistoryQuery(documentId, {
    skip: !documentId,
    pollingInterval: analysisSettled ? 0 : POLL_INTERVAL_MS,
  });

  return { data: data as ChatHistoryResponse | undefined, error, refetch, analysisSettled };
};

export default usePollingChatHistory;
