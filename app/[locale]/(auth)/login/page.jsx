'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import api from '@/lib/api';
import { setAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/admin/login', form);
      setAuth(data.token, data.data.admin, form.rememberMe);
      toast.success(data.message || 'Success');
      router.push(`/${locale}/dashboard`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 2%, transparent 2%)',
          backgroundSize: '30px 30px'
        }} />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Image src="/white.png" alt="RBS" width={140} height={140} className="mx-auto" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl font-bold mb-4 text-center"
            >
            Vision Roweiyat
            </motion.h1>
            <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-100 text-center max-w-md text-lg"
            >
            Almakkatul Arabiya Saudia
            </motion.p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="flex justify-between items-center mb-8">
            <Image src="/blue.png" alt="Logo" width={60} height={60} className="lg:hidden" />
            <div className="lg:ml-auto">
              <LanguageSwitcher />
            </div>
          </div>

          <div className="bg-white rounded-3xl card-shadow-lg p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">{t('loginTitle')}</h2>
              <p className="text-slate-500 text-sm">{t('loginSubtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <Mail className={`absolute top-9 w-4 h-4 text-slate-400 ${locale === 'ar' ? 'right-4' : 'left-4'}`} />
                <Input
                  label={t('email')}
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@rbs.com"
                  className={locale === 'ar' ? 'pr-11' : 'pl-11'}
                />
              </div>

              <div className="relative">
                <Lock className={`absolute top-9 w-4 h-4 text-slate-400 ${locale === 'ar' ? 'right-4' : 'left-4'}`} />
                <Input
                  label={t('password')}
                  type={showPass ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className={locale === 'ar' ? 'pr-11 pl-11' : 'pl-11 pr-11'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className={`absolute top-9 text-slate-400 ${locale === 'ar' ? 'left-4' : 'right-4'}`}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.rememberMe}
                    onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600"
                  />
                  <span className="text-sm text-slate-600">{t('rememberMe')}</span>
                </label>
                <Link
                  href={`/${locale}/forgot-password`}
                  className="text-sm text-blue-600 font-semibold hover:underline"
                >
                  {t('forgotPassword')}
                </Link>
              </div>

              <Button type="submit" loading={loading} size="lg" className="w-full">
                {loading ? t('signingIn') : t('signIn')}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}