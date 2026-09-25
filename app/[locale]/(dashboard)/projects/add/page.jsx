'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { ArrowLeft, Save, Upload, X, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input, { Textarea, Select } from '@/components/ui/Input';
import Loader from '@/components/ui/Loader';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AddProjectPage() {
  const t = useTranslations('projects');
  const tc = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [catLoading, setCatLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [form, setForm] = useState({
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    shortDescription: { en: '', ar: '' },
    category: '',
    duration: { en: '', ar: '' },
    size: '',
    location: { en: '', ar: '' },
    client: '',
    completionDate: '',
    status: 'completed',
    featured: false,
    technologies: '',
    features: { en: '', ar: '' }
  });

  useEffect(() => {
    (async () => {
      setCatLoading(true);
      try {
        const { data } = await api.get('/categories');
        const list = data?.data?.categories || [];
        setCategories(list);
      } catch (err) {
        console.error('Categories fetch error:', err);
        toast.error('Could not load categories from server');
      } finally {
        setCatLoading(false);
      }
    })();
  }, []);

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);
    setPreviews([...previews, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
    setPreviews(previews.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category) {
      toast.error('Please select a category');
      return;
    }

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

      const { data } = await api.post('/projects', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success(data.message || 'Project created');
      router.push(`/${locale}/projects`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <Link href={`/${locale}/projects`} className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" /> {t('backToList')}
      </Link>

      <div>
        <h1 className="text-3xl font-bold text-slate-800">{t('add')}</h1>
        <p className="text-slate-500 mt-1">Fill in bilingual project details</p>
      </div>

      {!catLoading && categories.length === 0 && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900">No categories found</p>
              <p className="text-sm text-amber-700 mt-1">
                You need to create at least one category before adding a project.
              </p>
              <Link href={`/${locale}/categories/add`}>
                <Button size="sm" className="mt-3">Create Category</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 space-y-5">
          <h3 className="font-bold text-slate-800">Basic Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label={t('titleEn')} required value={form.title.en}
              onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })} />
            <Input label={t('titleAr')} required value={form.title.ar} dir="rtl"
              onChange={(e) => setForm({ ...form, title: { ...form.title, ar: e.target.value } })} />
          </div>

          {catLoading ? (
            <div className="py-4"><Loader size="sm" /></div>
          ) : (
            <Select label={t('category')} required value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">{t('selectCategory')}</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name?.en} / {c.name?.ar}
                </option>
              ))}
            </Select>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Textarea label={t('descriptionEn')} required value={form.description.en}
              onChange={(e) => setForm({ ...form, description: { ...form.description, en: e.target.value } })} />
            <Textarea label={t('descriptionAr')} required value={form.description.ar} dir="rtl"
              onChange={(e) => setForm({ ...form, description: { ...form.description, ar: e.target.value } })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Textarea label={t('shortDescEn')} value={form.shortDescription.en}
              onChange={(e) => setForm({ ...form, shortDescription: { ...form.shortDescription, en: e.target.value } })} />
            <Textarea label={t('shortDescAr')} value={form.shortDescription.ar} dir="rtl"
              onChange={(e) => setForm({ ...form, shortDescription: { ...form.shortDescription, ar: e.target.value } })} />
          </div>
        </Card>

        <Card className="p-6 space-y-5">
          <h3 className="font-bold text-slate-800">Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label={t('durationEn')} required value={form.duration.en}
              onChange={(e) => setForm({ ...form, duration: { ...form.duration, en: e.target.value } })}
              placeholder="6 months" />
            <Input label={t('durationAr')} required value={form.duration.ar} dir="rtl"
              onChange={(e) => setForm({ ...form, duration: { ...form.duration, ar: e.target.value } })}
              placeholder="6 أشهر" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Input label={t('size')} required value={form.size}
              onChange={(e) => setForm({ ...form, size: e.target.value })} placeholder="500 m²" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Select label={t('status')} value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="completed">{t('completed')}</option>
              <option value="ongoing">{t('ongoing')}</option>
              <option value="upcoming">{t('upcoming')}</option>
            </Select>
            <label className="flex items-center gap-2 pt-8 cursor-pointer">
              <input type="checkbox" checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 rounded" />
              <span className="text-sm font-medium text-slate-700">{t('featured')}</span>
            </label>
          </div>

          <Input label={t('technologies')} value={form.technologies}
            onChange={(e) => setForm({ ...form, technologies: e.target.value })}
            placeholder="Concrete, Steel, Glass" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label={t('featuresEn')} value={form.features.en}
              onChange={(e) => setForm({ ...form, features: { ...form.features, en: e.target.value } })}
              placeholder="Modern, Eco-friendly" />
            <Input label={t('featuresAr')} value={form.features.ar} dir="rtl"
              onChange={(e) => setForm({ ...form, features: { ...form.features, ar: e.target.value } })}
              placeholder="حديث، صديق للبيئة" />
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="font-bold text-slate-800">{t('images')}</h3>

          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all">
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 font-medium">{t('uploadImages')}</p>
              <p className="text-xs text-slate-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
            <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
          </label>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="flex gap-3">
          <Button type="submit" loading={loading} size="lg" disabled={categories.length === 0}>
            <Save className="w-4 h-4" /> {t('saveProject')}
          </Button>
          <Button type="button" variant="secondary" size="lg" onClick={() => router.back()}>
            {tc('cancel')}
          </Button>
        </div>
      </form>
    </div>
  );
}