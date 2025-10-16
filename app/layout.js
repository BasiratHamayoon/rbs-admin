import { AuthProvider } from './contexts/AuthContext';
import './globals.css';

export const metadata = {
  title: 'RBS Construction - Admin Portal',
  description: 'Admin portal for RBS Construction Company',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}