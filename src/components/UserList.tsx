import React from 'react';
import Pagination from './Pagination';
import type { User, UserPage } from '@/types/userTypes';

interface UserListProps {
  users: UserPage;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const HEADERS = ['Email', 'First Name', 'Last Name', 'User Type', 'Status', 'Actions'];

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete, currentPage, setCurrentPage }) => (
  <div className="mt-8">
    <div className="relative overflow-x-auto shadow-md">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-200 text-xs uppercase text-gray-700">
          <tr>
            {HEADERS.map((header) => (
              <th key={header} scope="col" className="px-6 py-3 text-center">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.results.length === 0 ? (
            <tr>
              <td colSpan={HEADERS.length} className="px-6 py-4 text-center text-gray-500">
                No users on this page.
              </td>
            </tr>
          ) : (
            users.results.map((user) => (
              <tr key={user.id} className="border-b odd:bg-white even:bg-gray-50">
                <td className="px-6 py-4 text-center text-gray-900">{user.email}</td>
                <td className="px-6 py-4 text-center">{user.first_name}</td>
                <td className="px-6 py-4 text-center">{user.last_name}</td>
                <td className="px-6 py-4 text-center">{user.user_type}</td>
                <td className="px-6 py-4 text-center">{user.is_active ? 'Active' : 'Inactive'}</td>
                <td className="whitespace-nowrap px-6 py-4 text-center font-medium">
                  <button type="button" onClick={() => onEdit(user)} className="mr-4 text-gray-900 underline-offset-2 hover:underline" aria-label={`Edit ${user.email}`}>
                    Edit
                  </button>
                  <button type="button" onClick={() => onDelete(user)} className="text-red-700 hover:underline" aria-label={`Delete ${user.email}`}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    <Pagination page={currentPage} hasNext={Boolean(users.next)} onPageChange={(page) => setCurrentPage(Math.max(page, 1))} />
  </div>
);

export default UserList;
