import type { ChatHistoryEntry } from './chatTypes';

export type RegulationStatus =
  | 'pending'
  | 'STR Allowed'
  | 'STR Not Allowed'
  | 'STR Allowed with Restrictions'
  | 'STR Pending Approval';

export interface Regulation {
  id: number;
  date: string;
  search: string;
  status: RegulationStatus;
  gpt_response: { status?: string; message?: string; created_time?: string } | null;
  chat_history: ChatHistoryEntry[];
}
