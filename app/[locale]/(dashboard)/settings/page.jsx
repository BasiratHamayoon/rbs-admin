'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import api from '@/lib/api';
import { setAuth, getAuth } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({ username: '', email: '' });
  const [pwd, setPwd] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/admin/profile');
        setProfile({ username: data.data.admin.username, email: data.data.admin.email });
      } catch {}
    })();
  }, []);

  const updateProfile = async (e) => {
    e.preventDefault();
    setLoading1(true);
    try {
      const { data } = await api.patch('/admin/profile', profile);
      toast.success(data.message);
      const { token } = getAuth();
      setAuth(token, data.data.admin);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading1(false); }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    setLoading2(true);
    try {
      const { data } = await api.patch('/admin/change-password', pwd);
      toast.success(data.message);
      setPwd({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally { setLoading2(false); }
  };

  const tabs = [
    { id: 'profile', label: t('profile'), icon: User },
    { id: 'security', label: t('security'), icon: Lock }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">{t('title')}</h1>
        <p className="text-slate-500 mt-1">Manage your account preferences</p>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex px-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-blue-700'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">{t('profile')}</h2>
                    <p className="text-xs text-slate-500">Update your account information</p>
                  </div>
                </div>

                <form onSubmit={updateProfile} className="space-y-5">
                  <Input
                    label={t('username')}
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  />
                  <Input
                    label={t('email')}
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                  <div className="pt-2">
                    <Button type="submit" loading={loading1}>
                      <Save className="w-4 h-4" /> {t('updateProfile')}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">{t('changePassword')}</h2>
                    <p className="text-xs text-slate-500">Update your password securely</p>
                  </div>
                </div>

                <form onSubmit={updatePassword} className="space-y-5">
                  <Input
                    label={t('currentPassword')}
                    type="password"
                    required
                    value={pwd.currentPassword}
                    onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}
                  />
                  <Input
                    label={t('newPassword')}
                    type="password"
                    required
                    value={pwd.newPassword}
                    onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}
                  />
                  <Input
                    label={t('confirmPassword')}
                    type="password"
                    required
                    value={pwd.confirmPassword}
                    onChange={(e) => setPwd({ ...pwd, confirmPassword: e.target.value })}
                  />
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <p className="text-xs text-blue-700 leading-relaxed">{t('passwordRules')}</p>
                  </div>
                  <div className="pt-2">
                    <Button type="submit" loading={loading2}>
                      <Lock className="w-4 h-4" /> {t('updatePassword')}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  );
}