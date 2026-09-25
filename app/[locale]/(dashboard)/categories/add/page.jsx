'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input, { Textarea } from '@/components/ui/Input';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AddCategoryPage() {
  const t = useTranslations('categories');
  const tc = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: { en: '', ar: '' },
    description: { en: '', ar: '' },
    isActive: true
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/categories', form);
      toast.success(data.message);
      router.push(`/${locale}/categories`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href={`/${locale}/categories`} className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> {t('backToList')}
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-slate-800">{t('add')}</h1>
        <p className="text-slate-500 mt-1">Fill in bilingual details</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label={t('nameEn')}
              required
              value={form.name.en}
              onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })}
              placeholder="Villas"
            />
            <Input
              label={t('nameAr')}
              required
              value={form.name.ar}
              onChange={(e) => setForm({ ...form, name: { ...form.name, ar: e.target.value } })}
              placeholder="الفلل"
              dir="rtl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Textarea
              label={t('descEn')}
              value={form.description.en}
              onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })}
              placeholder="Modern villa designs..."
            />
            <Textarea
              label={t('descAr')}
              value={form.description.ar}
              onChange={(e) => setForm({ ...form, description: { ...form.description, ar: e.target.value } })}
              placeholder="تصاميم فلل حديثة..."
              dir="rtl"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-slate-700">{t('isActive')}</span>
          </label>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
            <Button type="submit" loading={loading} size="lg">
              <Save className="w-4 h-4" /> {t('saveCategory')}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => router.back()}>
              {tc('cancel')}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
}