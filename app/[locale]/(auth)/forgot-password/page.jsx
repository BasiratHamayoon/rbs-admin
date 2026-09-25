'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/admin/forgot-password', { email });
      toast.success(data.message);
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-8">
          <Image src="/blue.png" alt="Logo" width={60} height={60} />
          <LanguageSwitcher />
        </div>

        <div className="bg-white rounded-3xl card-shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('forgotTitle')}</h2>
            <p className="text-slate-500 text-sm">{t('forgotSubtitle')}</p>
          </div>

          {!sent ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label={t('email')}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rbs.com"
              />
              <Button type="submit" loading={loading} size="lg" className="w-full">
                {t('sendResetLink')}
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <p className="text-emerald-600 mb-4">✓ Reset link sent to your email</p>
            </div>
          )}

          <Link
            href={`/${locale}/login`}
            className="flex items-center justify-center gap-2 mt-6 text-sm text-blue-600 font-semibold hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> {t('backToLogin')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}