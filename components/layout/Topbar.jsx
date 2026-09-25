'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, LogOut, User, Hand } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { getAuth, clearAuth } from '@/lib/auth';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function Topbar({ onMenuClick }) {
  const t = useTranslations('auth');
  const tc = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const { admin } = getAuth();
    setAdmin(admin);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
    } catch {}
    clearAuth();
    toast.success('Logged out');
    router.push(`/${locale}/login`);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div className="flex items-center justify-between px-4 lg:px-8 py-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 lg:flex hidden items-center gap-2">
          <Hand className="w-4 h-4 text-amber-500" />
          <h2 className="text-slate-500 text-sm">{tc('welcomeBack')}</h2>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-700 to-blue-500 flex items-center justify-center text-white text-sm font-bold">
                {admin?.username?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-start">
                <p className="text-sm font-semibold text-slate-800">
                  {admin?.username || 'Admin'}
                </p>
              </div>
            </button>

            {dropdownOpen && (
              <div className={`absolute mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 ${locale === 'ar' ? 'left-0' : 'right-0'}`}>
                <div className="px-4 py-3 border-b border-slate-100">
                  <p className="text-sm font-semibold text-slate-800">{admin?.username}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{admin?.email}</p>
                </div>
                <button
                  onClick={() => { router.push(`/${locale}/settings`); setDropdownOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                >
                  <User className="w-4 h-4" /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" /> {t('logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}