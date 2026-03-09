export interface ChatHistoryEntry {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface AnalysisSummary {
  message: string | null;
  status: string | null;
  timestamp: string | null;
}

export interface ChatHistoryResponse {
  document_uploaded_at?: string;
  gpt_response: AnalysisSummary | null;
  chat_history: ChatHistoryEntry[];
}

export interface ChatReply {
  response: string;
  chat_history: ChatHistoryEntry[];
  summary?: string;
}

export interface ChatMessage {
  text: string;
  sender: 'user' | 'system';
  timestamp: string;
}
