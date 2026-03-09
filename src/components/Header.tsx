import React, { useState, useRef, useEffect } from 'react';
import { useGetUserProfileQuery } from '../services/api';
import Modal from './Modal';
import ChangePasswordForm from './ChangePasswordForm';
import HeaderDropdown from './HeaderDropdown';
import bnbLogo from '@/assets/images/bnb_logo.png';

const Header: React.FC = () => {
  const { data: user } = useGetUserProfileQuery(undefined);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : '?';

  useEffect(() => {
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between bg-red-500 p-2 shadow-lg">
      <img src={bnbLogo} alt="bnb University Logo" className="h-14" />
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={dropdownOpen}
          aria-label="Account menu"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 font-semibold text-gray-700 transition duration-300 hover:bg-gray-400"
          onClick={() => setDropdownOpen((open) => !open)}
        >
          {userInitial}
        </button>
        <HeaderDropdown isOpen={dropdownOpen} onClose={() => setDropdownOpen(false)} onChangePassword={() => setIsModalOpen(true)} />
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Change password">
        <ChangePasswordForm onClose={() => setIsModalOpen(false)} />
      </Modal>
    </header>
  );
};

export default Header;
