import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChartBarIcon, DocumentTextIcon, HomeIcon, ScaleIcon } from '@heroicons/react/24/outline';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', hint: 'Profile and accounts', Icon: HomeIcon },
  { to: '/regulations', label: 'RegAdvisor AI', hint: 'Short-term rental rules', Icon: ScaleIcon },
  { to: '/leases', label: 'LeaseGuard AI', hint: 'Lease reviews', Icon: DocumentTextIcon },
  { to: '/rental-analyzer', label: 'Rental Analyzer', hint: 'Batch profit estimates', Icon: ChartBarIcon },
];

interface SidebarProps {
  isOpen: boolean;
  onNavigate: () => void;
}

// Off-canvas below the md breakpoint, a fixed column above it.
const Sidebar: React.FC<SidebarProps> = ({ isOpen, onNavigate }) => (
  <aside
    id="sidebar"
    className={`fixed bottom-0 left-0 top-16 z-40 w-64 overflow-y-auto bg-pine-950 px-3 py-6 text-pine-100 transition-transform duration-200 md:static md:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full md:hidden'
    }`}
  >
    <p className="mb-3 px-3 text-xs font-medium uppercase tracking-[0.2em] text-brass-300">Workspace</p>
    <nav aria-label="Workspace">
      <ul className="space-y-1">
        {NAV_ITEMS.map(({ to, label, hint, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-start gap-3 rounded-md px-3 py-2 transition-colors ${
                  isActive ? 'bg-pine-800 text-white shadow-[inset_3px_0_0_#e3c27a]' : 'hover:bg-pine-900 hover:text-white'
                }`
              }
            >
              <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <span>
                <span className="block font-medium">{label}</span>
                <span className="block text-xs text-pine-200">{hint}</span>
              </span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
