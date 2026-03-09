import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useGetUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../services/api';
import UserForm, { UserFormValues } from './UserForm';
import UserList from './UserList';
import Chart from './Chart';
import Modal from './Modal';
import PageMessage from './PageMessage';
import type { User, UserPage } from '@/types/userTypes';

const AdminDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, isError, refetch } = useGetUsersQuery(currentPage);
  const users = data as UserPage | undefined;
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  // undefined: dialog closed; null: creating a user; a User: editing that user.
  const [editing, setEditing] = useState<User | null | undefined>(undefined);

  const closeDialog = () => setEditing(undefined);

  const handleSubmit = async (values: UserFormValues) => {
    try {
      if (editing) {
        await updateUser({ ...values, id: editing.id }).unwrap();
        toast.success('User updated successfully');
      } else {
        await createUser(values).unwrap();
        toast.success('User created successfully');
      }
      refetch();
      closeDialog();
    } catch {
      toast.error(editing ? 'Failed to update user' : 'Failed to create user');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Delete ${user.email}? This cannot be undone.`)) return;
    try {
      await deleteUser(user.id).unwrap();
      toast.success('User deleted successfully');
      refetch();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  if (isLoading) return <PageMessage kind="loading">Loading users…</PageMessage>;
  if (isError || !users) return <PageMessage kind="error">Error loading users.</PageMessage>;

  return (
    <div className="mx-auto w-full flex-1 bg-white p-4">
      <div className="mb-4 mt-7 flex flex-col items-center space-y-2 md:flex-row md:justify-between md:space-y-0">
        <h1 className="text-2xl font-semibold text-pine-900">Dashboard</h1>
        <button type="button" className="rounded bg-pine-700 px-4 py-2 text-white hover:bg-pine-800" onClick={() => setEditing(null)}>
          Create New User
        </button>
      </div>

      <Modal isOpen={editing !== undefined} onClose={closeDialog} title={editing ? 'Edit user' : 'Create user'}>
        <UserForm key={editing?.id ?? 'new'} onSubmit={handleSubmit} initialData={editing ?? null} onCancel={closeDialog} />
      </Modal>

      <UserList users={users} onEdit={setEditing} onDelete={handleDeleteUser} currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <section className="mx-auto w-full flex-1 bg-white p-10">
        <h2 className="mb-4 text-2xl font-bold">User types on this page</h2>
        <Chart data={users.results} />
      </section>
    </div>
  );
};

export default AdminDashboard;
