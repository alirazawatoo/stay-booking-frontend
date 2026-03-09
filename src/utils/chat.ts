import dayjs from 'dayjs';
import type { ChatHistoryEntry, ChatMessage } from '@/types/chatTypes';

export const formatChatTimestamp = (timestamp: string): string => dayjs(timestamp).format('DD/MM/YYYY hh:mm A');

export const toChatMessages = (history: ChatHistoryEntry[]): ChatMessage[] =>
  history
    .filter((entry) => entry?.content)
    .map((entry) => ({
      text: entry.content,
      sender: entry.role === 'user' ? 'user' : 'system',
      timestamp: formatChatTimestamp(entry.timestamp),
    }));
