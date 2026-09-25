'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Plus, Edit2, Trash2, FolderOpen, Star, ImageIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Loader from '@/components/ui/Loader';
import Modal from '@/components/ui/Modal';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const statusColors = {
  completed: 'bg-emerald-100 text-emerald-700',
  ongoing: 'bg-amber-100 text-amber-700',
  upcoming: 'bg-blue-100 text-blue-700'
};

export default function ProjectsPage() {
  const t = useTranslations('projects');
  const tc = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/projects?limit=100');
      setProjects(data.data.projects);
    } catch {
      toast.error('Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async () => {
    try {
      await api.delete(`/projects/${deleteId}`);
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
          <p className="text-slate-500 mt-1">{projects.length} projects</p>
        </div>
        <Link href={`/${locale}/projects/add`}>
          <Button size="lg">
            <Plus className="w-4 h-4" /> {t('add')}
          </Button>
        </Link>
      </div>

      {loading ? (
        <Loader />
      ) : projects.length === 0 ? (
        <Card className="p-12 text-center">
          <FolderOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">{t('noProjects')}</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('image')}</th>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('title')}</th>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('category')}</th>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('client')}</th>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('location')}</th>
                  <th className="text-start px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{t('status')}</th>
                  <th className="text-end px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">{tc('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                        {project.images?.[0] ? (
                          <Image
                            src={project.images[0].url}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-slate-400">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                        {project.featured && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                            <Star className="w-3 h-3 text-white fill-white" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800 text-sm line-clamp-1">
                        {project.title?.[locale] || project.title?.en}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {project.size}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700">
                        {project.category?.name?.[locale] || project.category?.name?.en || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{project.client}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-[150px] truncate">
                      {project.location?.[locale] || project.location?.en}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[project.status]}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          project.status === 'completed' ? 'bg-emerald-500' :
                          project.status === 'ongoing' ? 'bg-amber-500' : 'bg-blue-500'
                        }`}></span>
                        {t(project.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/${locale}/projects/edit/${project._id}`)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 transition-colors"
                          title={tc('edit')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(project._id)}
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