'use client';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';
import Cookies from 'js-cookie';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('common');
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleSwitch = (newLocale) => {
    Cookies.set('NEXT_LOCALE', newLocale);
    const segments = pathname.split('/');
    segments[1] = newLocale;
    startTransition(() => router.push(segments.join('/')));
  };

  return (
    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
      <Globe className="w-4 h-4 text-slate-500 mx-2" />
      <button
        onClick={() => handleSwitch('en')}
        disabled={isPending}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          locale === 'en' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => handleSwitch('ar')}
        disabled={isPending}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          locale === 'ar' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
        }`}
      >
        عربي
      </button>
    </div>
  );
}