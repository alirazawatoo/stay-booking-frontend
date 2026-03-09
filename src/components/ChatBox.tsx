import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useChatWithGptMutation } from '../services/api';
import usePollingChatHistory from '@/hooks/leasePollingChatHistory';
import { toggleRefreshDocuments } from '@/store/slices/authSlice';
import ChatPanel from './ChatPanel';

const ChatBox: React.FC<{ documentId: string | undefined }> = ({ documentId }) => {
  const dispatch = useDispatch();
  const { data, error, refetch, analysisSettled } = usePollingChatHistory(documentId);
  const [chatWithGpt] = useChatWithGptMutation();

  // The analysis also sets the document's review status, so refresh the lease once it lands.
  useEffect(() => {
    if (analysisSettled) dispatch(toggleRefreshDocuments());
  }, [analysisSettled, dispatch]);

  const sendMessage = async (message: string) => {
    if (!documentId) return;
    await chatWithGpt({ documentId, message }).unwrap();
    await refetch();
  };

  return <ChatPanel assistantName="LeaseGuard AI" history={data} hasError={Boolean(error)} onSend={sendMessage} />;
};

export default ChatBox;
