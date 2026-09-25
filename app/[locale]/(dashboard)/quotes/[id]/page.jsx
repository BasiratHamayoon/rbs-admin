'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  ArrowLeft, Mail, Phone, User, FileText, Calendar,
  DollarSign, Clock, Save, Trash2, Briefcase
} from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Textarea, Select } from '@/components/ui/Input';
import Loader from '@/components/ui/Loader';
import Modal from '@/components/ui/Modal';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const statusColors = {
  new: 'bg-blue-100 text-blue-700 border-blue-200',
  contacted: 'bg-amber-100 text-amber-700 border-amber-200',
  quoted: 'bg-purple-100 text-purple-700 border-purple-200',
  won: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  lost: 'bg-red-100 text-red-700 border-red-200'
};

export default function QuoteDetailPage() {
  const t = useTranslations('quotes');
  const tc = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const { id } = useParams();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('new');
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/quotes/${id}`);
        setQuote(data.data.quote);
        setNotes(data.data.quote.notes || '');
        setStatus(data.data.quote.status);
      } catch {
        toast.error('Failed to load');
        router.push(`/${locale}/quotes`);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/quotes/${id}`, { notes, status });
      toast.success('Updated');
    } catch {
      toast.error('Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/quotes/${id}`);
      toast.success('Deleted');
      router.push(`/${locale}/quotes`);
    } catch {
      toast.error('Failed');
    }
  };

  if (loading) return <Loader />;
  if (!quote) return null;

  const formatDate = (date) => new Date(date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link href={`/${locale}/quotes`} className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> {t('backToList')}
        </Link>
        <Button variant="danger" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="w-4 h-4" /> {tc('delete')}
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold text-slate-800">{t('detailTitle')}</h1>
        <p className="text-slate-500 mt-1 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> {formatDate(quote.createdAt)}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> {t('clientInfo')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">{t('name')}</p>
                <p className="text-slate-800 font-medium">{quote.name}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" /> {t('email')}
                </p>
                <a href={`mailto:${quote.email}`} className="text-blue-600 font-medium hover:underline break-all">
                  {quote.email}
                </a>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {t('phone')}
                </p>
                <a href={`tel:${quote.telephone}`} className="text-blue-600 font-medium hover:underline">
                  {quote.telephone}
                </a>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" /> {t('projectInfo')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">{t('projectType')}</p>
                <p className="text-slate-800 font-medium capitalize">{quote.projectType}</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl">
                <p className="text-xs text-emerald-700 uppercase font-semibold mb-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> {t('budget')}
                </p>
                <p className="text-emerald-800 font-bold">{quote.budget || '-'}</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-xl">
                <p className="text-xs text-amber-700 uppercase font-semibold mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {t('timeline')}
                </p>
                <p className="text-amber-800 font-medium">{quote.timeline || '-'}</p>
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl">
              <p className="text-xs text-slate-500 uppercase font-semibold mb-2">{t('message')}</p>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{quote.message}</p>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{t('status')}</h3>
            <div className={`mb-4 px-4 py-3 rounded-xl border ${statusColors[status]}`}>
              <p className="text-center font-semibold text-sm">{t(status)}</p>
            </div>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="new">{t('new')}</option>
              <option value="contacted">{t('contacted')}</option>
              <option value="quoted">{t('quoted')}</option>
              <option value="won">{t('won')}</option>
              <option value="lost">{t('lost')}</option>
            </Select>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">{t('notes')}</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes..."
              rows={5}
            />
            <Button onClick={handleSave} loading={saving} className="w-full mt-4">
              <Save className="w-4 h-4" /> {t('saveNotes')}
            </Button>
          </Card>
        </div>
      </div>

      <Modal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} title={t('confirmDelete')}
        footer={<>
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>{tc('cancel')}</Button>
          <Button variant="danger" onClick={handleDelete}>{tc('delete')}</Button>
        </>}>
        <p className="text-slate-600">This action cannot be undone.</p>
      </Modal>
    </div>
  );
}