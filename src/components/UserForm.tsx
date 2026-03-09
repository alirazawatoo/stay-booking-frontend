import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import type { User, UserType } from '@/types/userTypes';

export interface UserFormValues {
  email: string;
  first_name: string;
  last_name: string;
  user_type: UserType;
  is_active: boolean;
}

interface UserFormProps {
  onSubmit: (values: UserFormValues) => Promise<void> | void;
  initialData: User | null;
  onCancel?: () => void;
}

const USER_TYPES: { value: UserType; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'customer', label: 'Customer' },
  { value: 'research', label: 'Research' },
  { value: 'coach', label: 'Coach' },
  { value: 'client', label: 'Client' },
];

const INPUT =
  'mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 shadow-sm focus:border-pine-600 focus:outline-none focus:ring-pine-500 sm:text-sm';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  first_name: Yup.string().required('Required'),
  last_name: Yup.string().required('Required'),
  user_type: Yup.string().required('Required'),
  is_active: Yup.boolean().required('Required'),
});

// AdminDashboard remounts the form (via key) for each user, so initial values
// are read once instead of being copied back in from an effect.
const UserForm: React.FC<UserFormProps> = ({ onSubmit, initialData, onCancel }) => {
  const formik = useFormik<UserFormValues>({
    initialValues: {
      email: initialData?.email ?? '',
      first_name: initialData?.first_name ?? '',
      last_name: initialData?.last_name ?? '',
      user_type: initialData?.user_type ?? 'customer',
      is_active: initialData?.is_active ?? true,
    },
    validationSchema,
    onSubmit: (values) => onSubmit(values),
  });

  const fieldError = (name: keyof UserFormValues) =>
    formik.touched[name] && typeof formik.errors[name] === 'string' ? (
      <p id={`${name}-error`} className="text-sm text-red-700">
        {formik.errors[name]}
      </p>
    ) : null;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4" noValidate>
      {(
        [
          ['email', 'Email', 'email'],
          ['first_name', 'First Name', 'text'],
          ['last_name', 'Last Name', 'text'],
        ] as const
      ).map(([name, label, type]) => (
        <div key={name}>
          <label htmlFor={name} className="block text-sm font-medium text-stone-700">
            {label}
          </label>
          <input
            type={type}
            id={name}
            {...formik.getFieldProps(name)}
            aria-invalid={Boolean(formik.touched[name] && formik.errors[name])}
            aria-describedby={`${name}-error`}
            className={INPUT}
          />
          {fieldError(name)}
        </div>
      ))}
      <div>
        <label htmlFor="user_type" className="block text-sm font-medium text-stone-700">
          User Type
        </label>
        <select id="user_type" {...formik.getFieldProps('user_type')} className={INPUT}>
          {USER_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="is_active" className="block text-sm font-medium text-stone-700">
          Active
        </label>
        <select
          id="is_active"
          name="is_active"
          value={String(formik.values.is_active)}
          onChange={(event) => formik.setFieldValue('is_active', event.target.value === 'true')}
          className={INPUT}
        >
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={formik.isSubmitting}
        className="flex w-full justify-center rounded-md bg-pine-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pine-800 disabled:opacity-60"
      >
        {initialData ? 'Update User' : 'Create User'}
      </button>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="mt-3 flex w-full justify-center rounded-md bg-stone-200 px-4 py-2 text-sm font-medium text-stone-700 shadow-sm hover:bg-stone-300"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default UserForm;
