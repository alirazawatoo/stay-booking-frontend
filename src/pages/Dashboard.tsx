import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import UserDashboard from '../components/UserDashboard';
import { useGetUserProfileQuery } from '@/services/api';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
  const { data, isLoading, isSuccess, isError } = useGetUserProfileQuery(undefined);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-lg text-gray-700">Loading...</div>
        </div>
      </Layout>
    );
  }
  
  if (isError) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-lg text-red-500">Error loading data. Please try again.</div>
        </div>
      </Layout>
    );
  }

  // Mirrors the API: accounts created by an admin must replace their temporary
  // password before using the workspace; admins are exempt.
  if (isSuccess && data?.is_first_login && data.user_type !== 'admin') {
    return <Navigate to={`/update-password/${data.id}`} replace />;
  }

  if (isSuccess && data) {
    return (
      <Layout>
        <div className="flex-1 bg-white">
          {data.user_type === 'admin' ? <AdminDashboard /> : <UserDashboard />}
        </div>
      </Layout>
    );
  }

  return <Layout><div>No data available.</div></Layout>;
};

export default Dashboard;
