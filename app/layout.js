export const metadata = {
  title: 'رؤية روية - لوحة الإدارة | Vision Roweiyat',
  description: 'Vision Roweiyat Almakkatul Arabiya Saudia - لوحة تحكم الإدارة'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}