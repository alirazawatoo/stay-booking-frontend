import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { useGetUserProfileQuery } from '../services/api';
import Modal from './Modal';
import ChangePasswordForm from './ChangePasswordForm';
import HeaderDropdown from './HeaderDropdown';
import Wordmark from './Wordmark';

const Header: React.FC<{ onToggleNavigation: () => void; navigationOpen: boolean }> = ({ onToggleNavigation, navigationOpen }) => {
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
    <header className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b border-pine-950 bg-pine-800 px-3 sm:px-5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleNavigation}
          aria-label={navigationOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={navigationOpen}
          aria-controls="sidebar"
          className="rounded p-2 text-pine-100 hover:bg-pine-700"
        >
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
        <Link to="/dashboard" aria-label="Property Stay dashboard">
          <Wordmark />
        </Link>
      </div>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={dropdownOpen}
          aria-label="Account menu"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brass-300 font-semibold text-pine-950 transition hover:bg-brass-100"
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
