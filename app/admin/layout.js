'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Sidebar from '../components/admin/Sidebar';
import LoadingSpinner from '../components/admin/LoadingSpinner';
import { SidebarProvider, useSidebar } from '../contexts/SidebarContext';

function AdminLayoutContent({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const { sidebarOpen, closeSidebar } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login...');
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-white/20 backdrop-blur-[1px] z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 w-full">
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SidebarProvider>
  );
}