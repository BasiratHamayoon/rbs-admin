'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function LocaleIndexPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || 'en';

  useEffect(() => {
    router.replace(`/${locale}/login`);
  }, [router, locale]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}