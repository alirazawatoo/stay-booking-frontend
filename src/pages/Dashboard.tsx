import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import UserDashboard from '../components/UserDashboard';
import Layout from '../components/Layout';
import PageMessage from '../components/PageMessage';
import { useGetUserProfileQuery } from '@/services/api';
import type { User } from '@/types/userTypes';

const Dashboard: React.FC = () => {
  const { data, isLoading, isError } = useGetUserProfileQuery(undefined);
  const profile = data as User | undefined;

  // Mirrors the API: accounts created by an admin must replace their temporary
  // password before using the workspace; admins are exempt.
  if (profile?.is_first_login && profile.user_type !== 'admin') {
    return <Navigate to={`/update-password/${profile.id}`} replace />;
  }

  return (
    <Layout>
      {isLoading ? (
        <PageMessage kind="loading">Loading your workspace…</PageMessage>
      ) : isError || !profile ? (
        <PageMessage kind="error">Error loading your profile. Please try again.</PageMessage>
      ) : profile.user_type === 'admin' ? (
        <AdminDashboard />
      ) : (
        <UserDashboard user={profile} />
      )}
    </Layout>
  );
};

export default Dashboard;
