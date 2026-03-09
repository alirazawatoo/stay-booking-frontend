import React, { useEffect, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const SMALL_SCREEN = '(max-width: 767px)';
const isSmallScreen = () => Boolean(window.matchMedia?.(SMALL_SCREEN).matches);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigationOpen, setNavigationOpen] = useState(() => !isSmallScreen());

  // Follow the viewport: open beside the content on wide screens, closed on phones.
  useEffect(() => {
    const query = window.matchMedia?.(SMALL_SCREEN);
    if (!query) return;
    const syncWithViewport = () => setNavigationOpen(!query.matches);
    query.addEventListener('change', syncWithViewport);
    return () => query.removeEventListener('change', syncWithViewport);
  }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[60] focus:rounded focus:bg-white focus:p-2">
        Skip to content
      </a>
      <Header navigationOpen={navigationOpen} onToggleNavigation={() => setNavigationOpen((open) => !open)} />
      <div className="flex h-screen pt-16">
        <Sidebar isOpen={navigationOpen} onNavigate={() => isSmallScreen() && setNavigationOpen(false)} />
        {navigationOpen && (
          <div className="fixed inset-0 top-16 z-30 bg-pine-950/40 md:hidden" onClick={() => setNavigationOpen(false)} aria-hidden="true" />
        )}
        <main id="main" className="relative min-w-0 flex-1 overflow-y-auto bg-white md:rounded-tl-xl">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
