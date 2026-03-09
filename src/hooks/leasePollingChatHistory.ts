import { useGetChatHistoryQuery } from '@/services/api';

const POLL_INTERVAL_MS = 3000;

const usePollingChatHistory = (documentId: string | undefined, shouldPoll: boolean) => {
  const { data, error, refetch } = useGetChatHistoryQuery(documentId, {
    skip: !documentId,
    pollingInterval: shouldPoll ? POLL_INTERVAL_MS : 0,
  });

  return { data, error, refetch };
};

export default usePollingChatHistory;
