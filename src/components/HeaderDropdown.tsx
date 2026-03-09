import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api, useLogoutMutation } from '../services/api';
import { logout as logoutAction } from '../store/slices/authSlice';

interface HeaderDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: () => void;
}

const ITEM = 'block w-full rounded-md bg-white px-4 py-2 text-left text-gray-700 transition duration-200 hover:bg-gray-200 hover:text-black';

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({ isOpen, onClose, onChangePassword }) => {
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout({}).unwrap();
    } catch {
      // An expired or unreachable session must still be cleared on this device.
    } finally {
      dispatch(logoutAction());
      // Drop cached profile and lease data so the next account never sees it.
      dispatch(api.util.resetApiState());
      navigate('/');
    }
  };

  if (!isOpen) return null;

  return (
    <div role="menu" className="absolute right-0 z-50 mt-2 w-48 rounded-md bg-white shadow-lg">
      <button type="button" role="menuitem" onClick={handleLogout} className={ITEM}>
        Logout
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={() => {
          onChangePassword();
          onClose();
        }}
        className={ITEM}
      >
        Change Password
      </button>
    </div>
  );
};

export default HeaderDropdown;
