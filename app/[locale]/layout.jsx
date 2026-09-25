import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Toaster } from 'react-hot-toast';
import '../globals.css';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  
  if (locale === 'ar') {
    return {
      title: 'رؤية روية - لوحة الإدارة',
      description: 'رؤية روية المملكة العربية السعودية - لوحة تحكم الإدارة'
    };
  }

  return {
    title: 'Vision Roweiyat - Admin Panel',
    description: 'Vision Roweiyat Almakkatul Arabiya Saudia - Admin Panel'
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <NextIntlClientProvider messages={messages}>
      <div dir={dir} className="min-h-screen">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: '#0f172a',
              color: '#fff',
              borderRadius: '12px',
              padding: '14px 18px',
              fontSize: '14px'
            },
            success: { iconTheme: { primary: '#2563eb', secondary: '#fff' } }
          }}
        />
      </div>
    </NextIntlClientProvider>
  );
}