import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { ChatHistoryResponse, ChatMessage } from '@/types/chatTypes';
import { formatChatTimestamp, toChatMessages } from '@/utils/chat';

interface ChatPanelProps {
  assistantName: string;
  history: ChatHistoryResponse | undefined;
  hasError: boolean;
  onSend: (message: string) => Promise<void>;
}

// Shared by lease-document notes and regulation notes: a question box, the
// question/answer pairs newest first, then the initial model analysis.
const ChatPanel: React.FC<ChatPanelProps> = ({ assistantName, history, hasError, onSend }) => {
  const [input, setInput] = useState('');
  const [pendingMessage, setPendingMessage] = useState<ChatMessage | null>(null);
  const [sendError, setSendError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const message = input.trim();
    if (!message || pendingMessage) return;
    setSendError('');
    setPendingMessage({ text: message, sender: 'user', timestamp: formatChatTimestamp(new Date().toISOString()) });
    setInput('');
    try {
      await onSend(message);
    } catch {
      setSendError(`${assistantName} could not answer. Your question is back in the box; try again later.`);
      setInput(message);
    } finally {
      setPendingMessage(null);
    }
  };

  if (hasError) {
    return <p role="alert" className="mx-8 text-lg text-red-700">Error loading the conversation.</p>;
  }

  const messages = toChatMessages(history?.chat_history ?? []);
  if (pendingMessage) messages.push(pendingMessage);
  const exchanges: ChatMessage[][] = [];
  for (let i = 0; i < messages.length; i += 2) {
    exchanges.push(messages.slice(i, i + 2));
  }
  exchanges.reverse();

  const summary = history?.gpt_response?.message;
  const summaryTime = history?.gpt_response?.timestamp;

  return (
    <div className="mx-8 text-left">
      <form onSubmit={handleSubmit} className="mb-10 flex items-center justify-start gap-2 pl-3">
        <label htmlFor="chat-question" className="sr-only">
          Question for {assistantName}
        </label>
        <input
          id="chat-question"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          className="w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-red-300 sm:w-80 md:w-96 lg:w-1/2"
          placeholder={`Type your message to send it to ${assistantName}...`}
        />
        <button
          type="submit"
          disabled={Boolean(pendingMessage) || !input.trim()}
          className="rounded bg-red-500 p-2 text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Send
        </button>
      </form>
      {sendError && <p role="alert" className="mb-4 pl-3 text-sm text-red-700">{sendError}</p>}

      <div className="chat-messages mb-6 overflow-y-auto p-4 pl-0" style={{ maxHeight: 'calc(100vh - 300px)' }} aria-live="polite">
        {pendingMessage && <p className="text-center italic text-gray-500">{assistantName} is typing…</p>}
        {exchanges.map((exchange, index) => (
          <div key={index}>
            {exchange.map((message, messageIndex) => (
              <div key={messageIndex} className="mb-2">
                <div className="inline-block max-w-7xl rounded p-3 text-black">
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                  <div className="mt-1 text-xs text-gray-500">{message.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        ))}

        {summary && (
          <section className="mb-2 p-4" aria-label="Initial analysis">
            <strong>Initial Analysis</strong>
            {summaryTime && <div className="mb-7 text-xs text-gray-500">{formatChatTimestamp(summaryTime)}</div>}
            <div className="space-y-8">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
