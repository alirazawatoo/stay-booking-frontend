import React from 'react';
import { useGetRegulationChatHistoryQuery, useRegulationChatWithGptMutation } from '../services/api';
import type { Regulation } from '@/types/regulationTypes';
import type { ChatHistoryResponse } from '@/types/chatTypes';
import Breadcrumbs from './Breadcrumbs';
import StatusBadge from './StatusBadge';
import ChatPanel from './ChatPanel';

const RegulationChatBox: React.FC<{ regulation: Regulation }> = ({ regulation }) => {
  const [regulationChatWithGpt] = useRegulationChatWithGptMutation();
  const { data, error, refetch } = useGetRegulationChatHistoryQuery(regulation.id, { skip: !regulation.id });

  const sendMessage = async (message: string) => {
    await regulationChatWithGpt({ regulationId: regulation.id, message }).unwrap();
    await refetch();
  };

  return (
    <div className="text-left">
      <div className="mb-6 w-full px-12">
        <div className="mb-4 mt-10 md:mb-10">
          <h1 className="text-center text-2xl font-semibold text-pine-900 lg:text-left">Regulation Details</h1>
          <div className="text-center text-xs md:text-base lg:text-left">
            <Breadcrumbs items={[{ label: 'Your Regulation Searches', to: '/regulations' }, { label: regulation.search }]} />
          </div>
        </div>
        <p className="mb-4 text-center lg:text-left">{regulation.search}</p>
        <p className="text-center lg:text-left">
          <strong>Status:</strong> <StatusBadge status={regulation.status} />
        </p>
      </div>

      <ChatPanel
        assistantName="RegAdvisor AI"
        history={data as ChatHistoryResponse | undefined}
        hasError={Boolean(error)}
        onSend={sendMessage}
      />
    </div>
  );
};

export default RegulationChatBox;
