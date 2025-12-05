'use client';

import React, { useState } from 'react';
import {
  Home,
  CreditCard,
  History,
  HelpCircle,
  Globe,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';

const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const navItems = [
    { name: 'Accueil', icon: <Home className="w-5 h-5" />, path: '/dashboard' },
    { name: 'Paiement', icon: <CreditCard className="w-5 h-5" />, path: '/dashboard/pay' },
    { name: 'Historique', icon: <History className="w-5 h-5" />, path: '/dashboard/history' },
    { name: 'Aide', icon: <HelpCircle className="w-5 h-5" />, path: '/dashboard/help' }
  ];

  return (
    <>
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <img src="/logo.png" alt="PensionPay Logo" className="w-8 h-8" />
            </div>
            <h1 className="text-lg font-bold text-gray-900">PensionPay</h1>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
          </button>
        </div>
      </header>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-xl animate-slideInRight">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                  <img src="/logo.png" alt="PensionPay Logo" className="w-10 h-10" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">PensionPay</h1>
                  <p className="text-sm text-gray-500">Dashboard</p>
                </div>
              </div>

              <nav className="space-y-2 mb-8">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.path);
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="text-gray-500">{item.icon}</div>
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </nav>

              
                </div>
          </div>
        </>
      )}

      <div className="pt-16 lg:pt-0" />
    </>
  );
};

export default MobileSidebar;
