import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetRegulationByIdQuery } from '../services/api';
import Layout from '../components/Layout';
import PageMessage from '../components/PageMessage';
import RegulationChatBox from '../components/RegulationChatBox';
import type { RootState } from '@/store';

const ViewRegulationChat = () => {
  const { regulationId } = useParams();
  const { data: regulation, isLoading, isError, refetch } = useGetRegulationByIdQuery(regulationId);
  const refreshToggle = useSelector((state: RootState) => state.auth.refreshRegulations);
  useEffect(() => {
    refetch();
  }, [refreshToggle, refetch]);

  return (
    <Layout>
      {isLoading ? (
        <PageMessage kind="loading">Loading regulation…</PageMessage>
      ) : isError || !regulation ? (
        <PageMessage kind="error">Error loading regulation details.</PageMessage>
      ) : (
        <RegulationChatBox regulation={regulation} />
      )}
    </Layout>
  );
};

export default ViewRegulationChat;
