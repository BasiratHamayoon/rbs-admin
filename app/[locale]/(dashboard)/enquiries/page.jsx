'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Trash2, Mail, Eye, MessageSquare, Phone } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import Modal from '@/components/ui/Modal';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  'in-progress': 'bg-purple-100 text-purple-700',
  resolved: 'bg-emerald-100 text-emerald-700'
};

export default function EnquiriesPage() {
  const t = useTranslations('enquiries');
  const tc = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/enquiries?limit=100');
      setEnquiries(data.data.enquiries);
    } catch { toast.error('Failed'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/enquiries/${deleteId}`);
      toast.success('Deleted');
      setDeleteId(null);
      fetchData();
    } catch { toast.error('Failed'); }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">{t('title')}</h1>
        <p className="text-slate-500 mt-1">{enquiries.length} total</p>
      </div>

      {loading ? <Loader /> : enquiries.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">{t('noEnquiries')}</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('name')}</th>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('email')}</th>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('phone')}</th>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('type')}</th>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('status')}</th>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('date')}</th>
                  <th className="text-end px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{tc('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.map(e => (
                  <tr key={e._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {e.name?.[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-slate-800 text-sm">{e.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {e.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {e.telephone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium">
                        {e.enquiryType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[e.status]}`}>
                        {t(e.status === 'in-progress' ? 'inProgress' : e.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{formatDate(e.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/${locale}/enquiries/${e._id}`)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-colors"
                          title={t('view')}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(e._id)}
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

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title={t('confirmDelete')}
        footer={<>
          <Button variant="secondary" onClick={() => setDeleteId(null)}>{tc('cancel')}</Button>
          <Button variant="danger" onClick={handleDelete}>{tc('delete')}</Button>
        </>}>
        <p className="text-slate-600">This action cannot be undone.</p>
      </Modal>
    </div>
  );
}