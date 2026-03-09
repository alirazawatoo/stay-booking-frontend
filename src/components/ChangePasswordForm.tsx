import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useChangePasswordMutation } from '../services/api';

const FIELDS = [
  { id: 'old-password', label: 'Current password', autoComplete: 'current-password' },
  { id: 'new-password', label: 'New password', autoComplete: 'new-password' },
  { id: 'confirm-password', label: 'Confirm new password', autoComplete: 'new-password' },
] as const;

type FieldId = (typeof FIELDS)[number]['id'];

const ChangePasswordForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [values, setValues] = useState<Record<FieldId, string>>({ 'old-password': '', 'new-password': '', 'confirm-password': '' });
  const [error, setError] = useState<string | null>(null);
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (values['new-password'] !== values['confirm-password']) {
      setError('New password and confirm password do not match.');
      return;
    }
    setError(null);
    try {
      await changePassword({
        old_password: values['old-password'],
        new_password: values['new-password'],
        confirm_new_password: values['confirm-password'],
      }).unwrap();
      toast.success('Password changed successfully.');
      onClose();
    } catch {
      setError('The password was not changed. Check the current password and choose a longer, less common one.');
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-3">
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      {FIELDS.map((field) => (
        <label key={field.id} htmlFor={field.id} className="block text-sm font-medium text-gray-700">
          {field.label}
          <input
            id={field.id}
            type="password"
            autoComplete={field.autoComplete}
            value={values[field.id]}
            onChange={(event) => setValues((previous) => ({ ...previous, [field.id]: event.target.value }))}
            required
            className="mt-1 w-full rounded-md border p-2 font-normal"
          />
        </label>
      ))}
      <div className="flex justify-between gap-2 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 rounded-md bg-gray-600 px-8 py-2 text-white transition duration-200 hover:bg-gray-800 disabled:opacity-60"
        >
          Change Password
        </button>
        <button type="button" onClick={onClose} className="rounded-md bg-red-500 px-3 py-1 text-white transition duration-200 hover:bg-red-700">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
