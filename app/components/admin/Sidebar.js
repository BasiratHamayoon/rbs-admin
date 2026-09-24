'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Folder, 
  MessageSquare, 
  FileText, 
  LogOut,
  X,
  Settings
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useSidebar } from '../../contexts/SidebarContext';
import AdminManagementModal from './AdminManagementModal';

const Sidebar = () => {
  const { logout, admin } = useAuth();
  const { sidebarOpen, closeSidebar } = useSidebar();
  const router = useRouter();
  const pathname = usePathname();
  const [showAdminModal, setShowAdminModal] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { id: 'projects', label: 'Projects', icon: Folder, path: '/admin/projects' },
    { id: 'enquiries', label: 'Enquiries', icon: MessageSquare, path: '/admin/enquiries' },
    { id: 'quotes', label: 'Quotes', icon: FileText, path: '/admin/quotes' },
  ];

  const handleNavigation = (path) => {
    router.push(path);
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleAdminSettings = () => {
    setShowAdminModal(true);
    if (window.innerWidth < 1024) {
      closeSidebar();
    }
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 }
  };

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed lg:hidden w-64 bg-[#001C73] text-white h-screen p-6 flex flex-col z-50 left-0 top-0 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="relative w-32 h-12">
                <Image
                  src="/logos/white.png"
                  alt="RBS Admin Logo"
                  fill
                  sizes="130px"
                  className="object-contain object-left"
                  priority
                />
              </div>
              <button
                onClick={closeSidebar}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <motion.button
                    key={item.id}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-white text-[#001C73] shadow-lg'
                        : 'text-blue-100 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                );
              })}
            </nav>

            <div className="border-t border-blue-500 pt-4 mt-auto">
              <button
                onClick={handleAdminSettings}
                className="w-full flex items-center gap-3 px-4 py-3 mb-4 text-blue-100 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-300"
              >
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-white text-sm">
                    {admin?.username?.charAt(0).toUpperCase() || 'A'}
                  </span>
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="font-medium text-white text-sm truncate">
                    {admin?.username || 'Admin'}
                  </p>
                  <p className="text-blue-200 text-xs truncate">
                    {admin?.email || 'admin@rbsconstruction.com'}
                  </p>
                </div>
                <Settings size={16} className="text-blue-200" />
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-300"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="hidden lg:flex w-64 bg-[#001C73] text-white h-screen p-6 flex-col fixed left-0 top-0 overflow-y-auto z-30"
      >
        <div className="flex items-center mb-8">
          <div className="relative w-40 h-14">
            <Image
              src="/logos/white.png"
              alt="RBS Admin Logo"
              fill
              sizes="160px"
              className="object-contain object-left"
              priority
            />
          </div>
        </div>

        <nav className="flex-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <motion.button
                key={item.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-[#001C73] shadow-lg'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className="border-t border-blue-500 pt-4 mt-auto">
          <button
            onClick={handleAdminSettings}
            className="w-full flex items-center gap-3 px-4 py-3 mb-4 text-blue-100 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-300"
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-white text-sm">
                {admin?.username?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="font-medium text-white text-sm truncate">
                {admin?.username || 'Admin'}
              </p>
              <p className="text-blue-200 text-xs truncate">
                {admin?.email || 'admin@rbsconstruction.com'}
              </p>
            </div>
            <Settings size={16} className="text-blue-200" />
          </button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-blue-100 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-300"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </motion.div>

      <AdminManagementModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        currentAdmin={admin}
      />
    </>
  );
};

export default Sidebar;