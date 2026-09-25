'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, Tags, MessageSquare,
  FileText, Settings, X
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const t = useTranslations('nav');
  const tBrand = useTranslations('brand');
  const locale = useLocale();
  const pathname = usePathname();

  const menu = [
    { icon: LayoutDashboard, label: t('dashboard'), href: `/${locale}/dashboard` },
    { icon: FolderKanban, label: t('projects'), href: `/${locale}/projects` },
    { icon: Tags, label: t('categories'), href: `/${locale}/categories` },
    { icon: MessageSquare, label: t('enquiries'), href: `/${locale}/enquiries` },
    { icon: FileText, label: t('quotes'), href: `/${locale}/quotes` },
    { icon: Settings, label: t('settings'), href: `/${locale}/settings` }
  ];

  const isActive = (href) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 h-screen w-72 gradient-bg z-50 transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : locale === 'ar' ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${locale === 'ar' ? 'right-0' : 'left-0'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center p-1">
              <Image     src="/white.png" 
                  alt="Logo" 
                  width={40} 
                  height={40} 
                  priority
                  style={{ width: 'auto', height: 'auto' }}
                  className="object-contain"  />
            </div>
            <div>
              <h1 className="text-white font-bold text-base leading-tight">{tBrand('name')}</h1>
              <p className="text-blue-100 text-xs">{tBrand('tagline')}</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menu.map((item, i) => {
            const active = isActive(item.href);
            return (
              <Link key={i} href={item.href} onClick={onClose}>
                <motion.div
                  whileHover={{ x: locale === 'ar' ? -4 : 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    active
                      ? 'bg-white text-blue-700 shadow-lg'
                      : 'text-blue-100 hover:bg-white/10'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium text-sm">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <p className="text-white text-xs font-semibold leading-relaxed">{tBrand('fullName')}</p>
          </div>
        </div>
      </aside>
    </>
  );
}