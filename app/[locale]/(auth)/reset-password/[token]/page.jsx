'use client';
import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { KeyRound } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const { token } = useParams();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch(`/admin/reset-password/${token}`, form);
      toast.success(data.message);
      router.push(`/${locale}/login`);
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
              <KeyRound className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('resetTitle')}</h2>
            <p className="text-slate-500 text-sm">{t('resetSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label={t('newPassword')}
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
            <Input
              label={t('confirmPassword')}
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="••••••••"
            />
            <Button type="submit" loading={loading} size="lg" className="w-full">
              {t('resetPassword')}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}