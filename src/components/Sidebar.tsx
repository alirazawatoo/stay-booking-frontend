import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import icon from '@/assets/images/icon.png';
import menuicon from '@/assets/images/menuicon.png';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/regulations', label: 'RegAdvisor AI' },
  { to: '/leases', label: 'LeaseGuard AI' },
  { to: '/rental-analyzer', label: 'Rental Analyzer' },
];

const SMALL_SCREEN = '(max-width: 768px)';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => !window.matchMedia?.(SMALL_SCREEN).matches);

  // Collapse on small screens and reopen on large ones as the viewport changes.
  useEffect(() => {
    const query = window.matchMedia?.(SMALL_SCREEN);
    if (!query) return;
    const syncWithViewport = () => setIsOpen(!query.matches);
    query.addEventListener('change', syncWithViewport);
    return () => query.removeEventListener('change', syncWithViewport);
  }, []);

  return (
    <div>
      {!isOpen && (
        <button type="button" onClick={() => setIsOpen(true)} className="fixed top-16 z-50 p-4" aria-label="Open navigation" aria-controls="sidebar">
          <img src={menuicon} alt="" className="h-5 w-5" />
        </button>
      )}

      <aside
        id="sidebar"
        className={`fixed bottom-0 left-0 top-16 z-40 h-full w-64 transform overflow-auto bg-gray-300 p-6 transition-transform duration-300 md:top-0 ${
          isOpen ? 'translate-x-0 md:static' : '-translate-x-full md:absolute md:-translate-x-full'
        }`}
      >
        <button type="button" onClick={() => setIsOpen(false)} className="absolute right-4 top-4 z-50" aria-label="Close navigation" aria-controls="sidebar">
          <img src={menuicon} alt="" className="h-5 w-5" />
        </button>

        <p className="mb-3 ml-2 mt-1 font-bold text-black">Your Menu</p>

        <nav aria-label="Workspace">
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 whitespace-nowrap rounded p-2 text-gray-700 transition-colors duration-200 hover:bg-gray-400 hover:text-black ${
                      isActive ? 'bg-gray-400 font-bold text-black' : ''
                    }`
                  }
                >
                  <img src={icon} alt="" className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
