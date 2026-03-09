import React from 'react';
import type { User } from '@/types/userTypes';

const UserDashboard: React.FC<{ user: User }> = ({ user }) => {
  const rows: [string, string][] = [
    ['Email Address', user.email],
    ['First Name', user.first_name],
    ['Last Name', user.last_name],
    ['User Type', user.user_type],
    ['Status', user.is_active ? 'Active' : 'Inactive'],
  ];

  return (
    <div className="mx-auto h-full max-w-4xl overflow-hidden bg-white p-4 pt-8 shadow sm:rounded-lg sm:p-6 lg:p-8">
      <h1 className="px-4 py-5 text-lg font-medium leading-6 text-gray-900 sm:px-6">User Information</h1>
      <dl className="border-t border-gray-200">
        {rows.map(([label, value], index) => (
          <div key={label} className={`grid grid-cols-1 px-4 py-5 sm:grid-cols-3 sm:gap-4 sm:px-6 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
            <dt className="text-sm font-medium text-gray-600">{label}</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default UserDashboard;
