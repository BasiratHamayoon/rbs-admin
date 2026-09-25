'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import Modal from '@/components/ui/Modal';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function CategoriesPage() {
  const t = useTranslations('categories');
  const tc = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data.categories);
    } catch {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${deleteId}`);
      toast.success('Deleted');
      setDeleteId(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{t('title')}</h1>
          <p className="text-slate-500 mt-1">{categories.length} total</p>
        </div>
        <Link href={`/${locale}/categories/add`}>
          <Button size="lg">
            <Plus className="w-4 h-4" /> {t('add')}
          </Button>
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : categories.length === 0 ? (
        <Card className="p-12 text-center">
          <Tag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">{t('noCategories')}</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">#</th>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('name')}</th>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('slug')}</th>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('description')}</th>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('isActive')}</th>
                  <th className="text-end px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{tc('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat, i) => (
                  <tr key={cat._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{i + 1}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800 text-sm">
                        {cat.name?.[locale] || cat.name?.en}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <code className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">{cat.slug}</code>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                      {cat.description?.[locale] || cat.description?.en || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        cat.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        {cat.isActive ? t('isActive') : t('inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/${locale}/categories/edit/${cat._id}`)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-colors"
                          title={tc('edit')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(cat._id)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 transition-colors"
                          title={tc('delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title={t('confirmDelete')}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>{tc('cancel')}</Button>
            <Button variant="danger" onClick={handleDelete}>{tc('delete')}</Button>
          </>
        }
      >
        <p className="text-slate-600">This action cannot be undone.</p>
      </Modal>
    </div>
  );
}