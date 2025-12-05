// components/layout/Layout.tsx
import React, { ReactNode } from 'react';
import Sidebar from './SideBar';
import MobileSidebar from './MobileSidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Sidebar Mobile */}
      <div className="lg:hidden">
        <MobileSidebar />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
};

export default Layout;
