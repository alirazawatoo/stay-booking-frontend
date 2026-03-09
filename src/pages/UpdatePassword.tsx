import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useUpdatePasswordMutation } from '../services/api';
import Wordmark from '../components/Wordmark';

const INPUT = 'mt-2 w-full rounded-lg border border-stone-300 bg-white px-4 py-3 font-normal';

const UpdatePassword: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [updatePassword, { isLoading }] = useUpdatePasswordMutation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmation) {
      setError('The two passwords do not match.');
      return;
    }
    setError('');
    try {
      await updatePassword({ id, passwordData: { new_password: password, confirm_password: confirmation } }).unwrap();
      toast.success('Password updated successfully!');
      navigate('/dashboard');
    } catch {
      setError('The password could not be updated. It may be too short or too common.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-stone-50 px-6 py-12">
      <div className="w-full max-w-md rounded-xl border border-stone-200 bg-white p-8 shadow-sm">
        <Wordmark tone="dark" />
        <h1 className="mt-8 text-3xl font-semibold text-stone-900">Update your password</h1>
        <p className="mt-2 text-stone-600">Your account was created with a temporary password. Choose your own before continuing.</p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label htmlFor="new-password" className="block text-sm font-medium">
            New password
            <input id="new-password" type="password" autoComplete="new-password" required value={password} onChange={(event) => setPassword(event.target.value)} className={INPUT} />
          </label>
          <label htmlFor="confirm-password" className="block text-sm font-medium">
            Confirm new password
            <input id="confirm-password" type="password" autoComplete="new-password" required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className={INPUT} />
          </label>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-pine-700 py-3 font-medium text-white hover:bg-pine-800 disabled:opacity-60">
            Update Password
          </button>
        </form>
      </div>
    </main>
  );
};

export default UpdatePassword;
