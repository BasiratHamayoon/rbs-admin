'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input, { Textarea, Select } from '@/components/ui/Input';
import Loader from '@/components/ui/Loader';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function EditProjectPage() {
  const t = useTranslations('projects');
  const tc = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [cats, proj] = await Promise.all([
          api.get('/categories'),
          api.get(`/projects/${id}`)
        ]);
        setCategories(cats.data.data.categories);
        const p = proj.data.data.project;
        setForm({
          title: p.title || { en: '', ar: '' },
          description: p.description || { en: '', ar: '' },
          shortDescription: p.shortDescription || { en: '', ar: '' },
          category: p.category?._id || '',
          duration: p.duration || { en: '', ar: '' },
          size: p.size || '',
          location: p.location || { en: '', ar: '' },
          client: p.client || '',
          completionDate: p.completionDate?.split('T')[0] || '',
          status: p.status || 'completed',
          featured: p.featured || false,
          technologies: (p.technologies || []).join(', '),
          features: {
            en: (p.features?.en || []).join(', '),
            ar: (p.features?.ar || []).join(', ')
          }
        });
        setExistingImages(p.images || []);
      } catch {
        toast.error('Failed to load');
        router.push(`/${locale}/projects`);
      } finally {
        setFetching(false);
      }
    })();
  }, [id]);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    setPreviews([...previews, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeNew = (i) => {
    setImages(images.filter((_, x) => x !== i));
    setPreviews(previews.filter((_, x) => x !== i));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const fd = new FormData();
      const payload = {
        ...form,
        technologies: form.technologies.split(',').map(x => x.trim()).filter(Boolean),
        features: {
          en: form.features.en.split(',').map(x => x.trim()).filter(Boolean),
          ar: form.features.ar.split(',').map(x => x.trim()).filter(Boolean)
        }
      };

      fd.append('data', JSON.stringify(payload));
      images.forEach(img => fd.append('images', img));

      await api.patch(`/projects/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Updated');
      router.push(`/${locale}/projects`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !form) return <Loader />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href={`/${locale}/projects`} className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> {t('backToList')}
      </Link>

      <h1 className="text-3xl font-bold text-slate-800">{t('edit')}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label={t('titleEn')} required value={form.title.en}
              onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })} />
            <Input label={t('titleAr')} required value={form.title.ar} dir="rtl"
              onChange={(e) => setForm({ ...form, title: { ...form.title, ar: e.target.value } })} />
          </div>

          <Select label={t('category')} required value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">{t('selectCategory')}</option>
            {categories.map(c => (
              <option key={c._id} value={c._id}>{c.name.en} / {c.name.ar}</option>
            ))}
          </Select>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Textarea label={t('descriptionEn')} required value={form.description.en}
              onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })} />
            <Textarea label={t('descriptionAr')} required value={form.description.ar} dir="rtl"
              onChange={(e) => setForm({ ...form, description: { ...form.description, ar: e.target.value } })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label={t('durationEn')} required value={form.duration.en}
              onChange={(e) => setForm({ ...form, duration: { ...form.duration, en: e.target.value } })} />
            <Input label={t('durationAr')} required value={form.duration.ar} dir="rtl"
              onChange={(e) => setForm({ ...form, duration: { ...form.duration, ar: e.target.value } })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input label={t('size')} required value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })} />
            <Input label={t('client')} required value={form.client}
              onChange={(e) => setForm({ ...form, client: e.target.value })} />
            <Input label={t('completionDate')} type="date" required value={form.completionDate}
              onChange={(e) => setForm({ ...form, completionDate: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label={t('locationEn')} required value={form.location.en}
              onChange={(e) => setForm({ ...form, location: { ...form.location, en: e.target.value } })} />
            <Input label={t('locationAr')} required value={form.location.ar} dir="rtl"
              onChange={(e) => setForm({ ...form, location: { ...form.location, ar: e.target.value } })} />
          </div>

          <Select label={t('status')} value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="completed">{t('completed')}</option>
            <option value="ongoing">{t('ongoing')}</option>
            <option value="upcoming">{t('upcoming')}</option>
          </Select>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="w-4 h-4 rounded" />
            <span className="text-sm font-medium text-slate-700">{t('featured')}</span>
          </label>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-slate-800">{t('images')}</h3>

          {existingImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {existingImages.map((img, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden">
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600">Upload new images (will replace old)</p>
            </div>
            <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
          </label>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeNew(i)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="flex gap-3">
          <Button type="submit" loading={loading} size="lg">
            <Save className="w-4 h-4" /> {t('updateProject')}
          </Button>
          <Button type="button" variant="secondary" size="lg" onClick={() => router.back()}>
            {tc('cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
}