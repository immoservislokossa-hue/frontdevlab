'use client'

import React, { useState, useEffect } from 'react';
import {
  Home, CreditCard, History,
  ChevronLeft, ChevronRight,
  LogOut, HelpCircle
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activePage, setActivePage] = useState('');

  useEffect(() => {
    setActivePage(pathname);
  }, [pathname]);

  const navItems = [
    { name: 'Accueil', icon: <Home className="w-5 h-5" />, path: '/dashboard', key: 'dashboard' },
    { name: 'Paiement  ', icon: <CreditCard className="w-5 h-5" />, path: '/dashboard/pay', key: 'pay' },
    { name: 'Historique', icon: <History className="w-5 h-5" />, path: '/dashboard/history', key: 'history' },
    { name: 'Aide', icon: <HelpCircle className="w-5 h-5" />, path: '/dashboard/help', key: 'help' }
  ];

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  const goTo = (path: string) => router.push(path);

  return (
    <div className="flex">
      <aside
        className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 fixed top-0 left-0 z-50 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* HEADER */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!isCollapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <img src="/PENSIPAY.png" alt="PensionPay Logo" className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">PensiPay</h1>
                <p className="text-xs text-gray-500">Dashboard</p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <img src="/logo.png" alt="PensionPay Logo" className="w-8 h-8" />
              </div>
            </div>
          )}

          <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive =
              activePage === item.path || activePage.startsWith(`/dashboard/${item.key}`);

            return (
              <button
                key={item.key}
                onClick={() => goTo(item.path)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-600   '
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className={isActive ? 'text-blue-600' : 'text-gray-500'}>{item.icon}</div>
                {!isCollapsed && <span className="font-medium">{item.name}</span>}
              </button>
            );
          })}
        </nav>

        {/* LOGOUT */}
        
      </aside>

      {/* CONTENT OFFSET */}
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`} />
    </div>
  );
};

export default Sidebar;
