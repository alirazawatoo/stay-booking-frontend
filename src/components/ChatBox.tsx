import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useChatWithGptMutation } from '../services/api';
import usePollingChatHistory from '@/hooks/leasePollingChatHistory';
import { toggleRefreshDocuments } from '@/store/slices/authSlice';
import { parseServerTimestamp } from '@/utils/dates';
import type { ChatHistoryResponse } from '@/types/chatTypes';
import ChatPanel from './ChatPanel';

const ANALYSIS_POLL_WINDOW_MS = 20 * 60 * 1000;

const ChatBox: React.FC<{ documentId: string | undefined }> = ({ documentId }) => {
  const [shouldPoll, setShouldPoll] = useState(true);
  const dispatch = useDispatch();
  const { data, error, refetch } = usePollingChatHistory(documentId, shouldPoll);
  const history = data as ChatHistoryResponse | undefined;
  const [chatWithGpt] = useChatWithGptMutation();

  // The initial analysis runs in a background task. Poll until it reports a
  // result, but give up 20 minutes after upload so a lost task cannot poll forever.
  useEffect(() => {
    if (!shouldPoll || !history) return;
    const uploadedAt = parseServerTimestamp(history.document_uploaded_at);
    const pollingExpired = uploadedAt !== null && Date.now() - uploadedAt > ANALYSIS_POLL_WINDOW_MS;
    const status = history.gpt_response?.status;
    if (pollingExpired || (status && status !== 'Pending')) {
      setShouldPoll(false);
      dispatch(toggleRefreshDocuments());
    }
  }, [shouldPoll, history, dispatch]);

  const sendMessage = async (message: string) => {
    if (!documentId) return;
    await chatWithGpt({ documentId, message }).unwrap();
    await refetch();
  };

  return <ChatPanel assistantName="LeaseGuard AI" history={history} hasError={Boolean(error)} onSend={sendMessage} />;
};

export default ChatBox;
