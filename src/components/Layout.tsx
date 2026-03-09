import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-white">
    <Header />
    <div className="flex h-screen pt-16">
      <Sidebar />
      <main className="relative flex-1 overflow-y-auto">{children}</main>
    </div>
  </div>
);

export default Layout;
