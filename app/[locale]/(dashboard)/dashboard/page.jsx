'use client';
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { FolderKanban, Tags, MessageSquare, FileText, TrendingUp } from 'lucide-react';
import Card from '@/components/ui/Card';
import api from '@/lib/api';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const [stats, setStats] = useState({
    projects: 0,
    categories: 0,
    enquiries: 0,
    quotes: 0,
    newEnquiries: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const results = await Promise.allSettled([
          api.get('/projects?limit=1'),
          api.get('/categories'),
          api.get('/enquiries/stats'),
          api.get('/quotes?limit=1')
        ]);

        if (!isMounted) return;

        const [p, c, e, q] = results;

        setStats({
          projects: p.status === 'fulfilled' ? p.value.data?.data?.total || 0 : 0,
          categories: c.status === 'fulfilled' ? c.value.data?.results || c.value.data?.data?.categories?.length || 0 : 0,
          enquiries: e.status === 'fulfilled' ? e.value.data?.data?.total || 0 : 0,
          quotes: q.status === 'fulfilled' ? q.value.data?.data?.total || q.value.data?.results || 0 : 0,
          newEnquiries: e.status === 'fulfilled' ? e.value.data?.data?.newEnquiries || 0 : 0
        });
      } catch (err) {
        console.error('Dashboard stats fetch error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = [
    { label: t('totalProjects'), value: stats.projects, icon: FolderKanban, color: 'from-blue-500 to-blue-700' },
    { label: t('totalCategories'), value: stats.categories, icon: Tags, color: 'from-purple-500 to-purple-700' },
    { label: t('totalEnquiries'), value: stats.enquiries, icon: MessageSquare, color: 'from-emerald-500 to-emerald-700' },
    { label: t('totalQuotes'), value: stats.quotes, icon: FileText, color: 'from-amber-500 to-amber-700' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">{t('title')}</h1>
        <p className="text-slate-500 mt-1">{t('welcome')}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-sm text-slate-500 mb-1">{card.label}</p>
              <p className="text-3xl font-bold text-slate-800">
                {loading ? '...' : card.value}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-slate-800 mb-4">{t('newEnquiries')}</h3>
          <div className="text-5xl font-bold text-blue-600">
            {loading ? '...' : stats.newEnquiries}
          </div>
          <p className="text-sm text-slate-500 mt-2">Pending your response</p>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-slate-800 mb-4">{t('recentActivity')}</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-slate-600">System is running smoothly</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}