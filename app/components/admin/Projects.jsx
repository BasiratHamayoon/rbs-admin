"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Folder, Search, MapPin, Calendar, Ruler, Star, Eye, X, ImageIcon, User, Clock, Briefcase, CheckCircle, Tag } from 'lucide-react';
import Header from './Header';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import ProjectForm from './ProjectForm';
import { projectAPI } from '../../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewingProject, setViewingProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAll();
      const projectsData =
        response?.data?.data?.projects ||
        response?.data?.projects ||
        response?.data ||
        [];
      setProjects(Array.isArray(projectsData) ? projectsData : []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await projectAPI.delete(id);
        setProjects(projects.filter((project) => project._id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleView = (project) => {
    setViewingProject(project);
    setCurrentImageIndex(0);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleFormSuccess = () => {
    fetchProjects();
    handleFormClose();
  };

  const categories = ['all', ...new Set(projects.map((p) => p.category).filter(Boolean))];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#001C73] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-white">
      <Header title="Projects" subtitle="Manage your construction projects" />

      <div className="p-4 md:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-[#001C73]">All Projects</h2>
              <p className="text-gray-600 mt-1">
                {filteredProjects.length} {filteredProjects.length === 1 ? 'project' : 'projects'} found
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#001C73] hover:bg-[#001255] transition-all duration-300 px-6 py-3 rounded-xl text-white font-semibold"
            >
              <Plus size={20} />
              Add New Project
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects by title, description, location, or client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent text-gray-900 placeholder-gray-500 transition-all"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#001C73] text-gray-900 bg-white font-medium min-w-[200px]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {filteredProjects.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
          >
            <table className="w-full">
              <thead>
                <tr className="bg-[#001C73] text-white">
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider w-20">Image</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Project Title</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Category</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Location</th>
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wider">Completion</th>
                  <th className="px-4 py-4 text-center text-xs font-bold uppercase tracking-wider w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredProjects.map((project, index) => (
                  <motion.tr
                    key={project._id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-blue-50/50 transition-colors group"
                  >
                    <td className="px-4 py-4">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                        {project.images && project.images.length > 0 ? (
                          <>
                            <img
                              src={project.images[0].url}
                              alt={project.title}
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => handleView(project)}
                            />
                            {project.images.length > 1 && (
                              <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-tl-md">
                                +{project.images.length - 1}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2 max-w-xs">
                        <p className="font-semibold text-gray-900 line-clamp-1">{project.title}</p>
                        {project.featured && (
                          <Star size={14} className="text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex px-3 py-1 bg-[#001C73] text-white text-xs font-bold rounded-full">
                        {project.category}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-gray-700 max-w-[200px]">
                        <MapPin size={14} className="text-[#001C73] flex-shrink-0" />
                        <span className="line-clamp-1">{project.location || 'N/A'}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <p className="text-sm text-gray-700 whitespace-nowrap">
                        {formatDate(project.completionDate)}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(project)}
                          className="w-9 h-9 flex items-center justify-center bg-blue-50 text-[#001C73] hover:bg-[#001C73] hover:text-white rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEdit(project)}
                          className="w-9 h-9 flex items-center justify-center bg-blue-50 text-[#001C73] hover:bg-[#001C73] hover:text-white rounded-lg transition-all"
                          title="Edit Project"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="w-9 h-9 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                          title="Delete Project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            <div className="px-6 py-4 bg-white border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing <span className="font-bold text-[#001C73]">{filteredProjects.length}</span>{' '}
                {filteredProjects.length === 1 ? 'project' : 'projects'}
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>All data is up to date</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-md border border-gray-200 text-center py-16 px-6"
          >
            <div className="w-24 h-24 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
              <Folder size={48} className="text-[#001C73]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchTerm || filterCategory !== 'all' ? 'No Matching Projects' : 'No Projects Yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || filterCategory !== 'all'
                ? 'Try adjusting your search or filter.'
                : 'Get started by adding your first construction project to showcase your work.'}
            </p>
            {!searchTerm && filterCategory === 'all' && (
              <Button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 mx-auto bg-[#001C73] hover:bg-[#001255] transition-all duration-300 px-6 py-3 rounded-xl text-white font-semibold"
              >
                <Plus size={20} />
                Add First Project
              </Button>
            )}
          </motion.div>
        )}
      </div>

      <Modal
        isOpen={showForm}
        onClose={handleFormClose}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        size="lg"
      >
        <ProjectForm
          project={editingProject}
          onSuccess={handleFormSuccess}
          onCancel={handleFormClose}
        />
      </Modal>

      <AnimatePresence>
        {viewingProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setViewingProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col my-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 bg-[#001C73] text-white">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{viewingProject.title}</h2>
                  {viewingProject.featured && (
                    <span className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full text-xs font-bold">
                      <Star size={12} fill="currentColor" />
                      Featured
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setViewingProject(null)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {viewingProject.images && viewingProject.images.length > 0 && (
                  <div className="relative bg-gray-100">
                    <div className="relative h-80 md:h-96 overflow-hidden">
                      <img
                        src={viewingProject.images[currentImageIndex]?.url}
                        alt={`${viewingProject.title} ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {viewingProject.images.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              setCurrentImageIndex((prev) =>
                                prev === 0 ? viewingProject.images.length - 1 : prev - 1
                              )
                            }
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-[#001C73] rounded-full flex items-center justify-center shadow-lg transition-all"
                          >
                            ←
                          </button>
                          <button
                            onClick={() =>
                              setCurrentImageIndex((prev) =>
                                prev === viewingProject.images.length - 1 ? 0 : prev + 1
                              )
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white text-[#001C73] rounded-full flex items-center justify-center shadow-lg transition-all"
                          >
                            →
                          </button>
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {currentImageIndex + 1} / {viewingProject.images.length}
                          </div>
                        </>
                      )}
                    </div>

                    {viewingProject.images.length > 1 && (
                      <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
                        {viewingProject.images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                              currentImageIndex === idx
                                ? 'border-[#001C73] shadow-lg'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={img.url}
                              alt={`Thumbnail ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="p-6 space-y-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#001C73] text-white text-sm font-semibold rounded-full">
                      <Tag size={14} />
                      {viewingProject.category}
                    </span>
                    {viewingProject.status && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-800 text-sm font-semibold rounded-full capitalize">
                        <CheckCircle size={14} />
                        {viewingProject.status}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#001C73] uppercase tracking-wide mb-2">
                      Description
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {viewingProject.description || 'No description available.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4 text-[#001C73]" />
                        <p className="text-xs font-bold text-[#001C73] uppercase tracking-wide">Client</p>
                      </div>
                      <p className="text-gray-900 font-semibold">{viewingProject.client || 'N/A'}</p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-[#001C73]" />
                        <p className="text-xs font-bold text-[#001C73] uppercase tracking-wide">Location</p>
                      </div>
                      <p className="text-gray-900 font-semibold">{viewingProject.location || 'N/A'}</p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-[#001C73]" />
                        <p className="text-xs font-bold text-[#001C73] uppercase tracking-wide">Duration</p>
                      </div>
                      <p className="text-gray-900 font-semibold">{viewingProject.duration || 'N/A'}</p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <Ruler className="w-4 h-4 text-[#001C73]" />
                        <p className="text-xs font-bold text-[#001C73] uppercase tracking-wide">Size</p>
                      </div>
                      <p className="text-gray-900 font-semibold">{viewingProject.size || 'N/A'}</p>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 md:col-span-2">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-[#001C73]" />
                        <p className="text-xs font-bold text-[#001C73] uppercase tracking-wide">Completion Date</p>
                      </div>
                      <p className="text-gray-900 font-semibold">{formatDate(viewingProject.completionDate)}</p>
                    </div>
                  </div>

                  {viewingProject.technologies && viewingProject.technologies.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-[#001C73] uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Briefcase size={16} />
                        Technologies Used
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {viewingProject.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-white border border-[#001C73]/30 text-[#001C73] rounded-full text-sm font-medium shadow-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {viewingProject.features && viewingProject.features.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-[#001C73] uppercase tracking-wide mb-3 flex items-center gap-2">
                        <CheckCircle size={16} />
                        Key Features
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {viewingProject.features.map((feature, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg border border-blue-100"
                          >
                            <div className="w-1.5 h-1.5 bg-[#001C73] rounded-full flex-shrink-0"></div>
                            <span className="text-sm text-gray-800 font-medium">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-200">
                <Button
                  onClick={() => setViewingProject(null)}
                  variant="secondary"
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-xl font-semibold"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    handleEdit(viewingProject);
                    setViewingProject(null);
                  }}
                  className="px-5 py-2.5 bg-[#001C73] hover:bg-[#001255] text-white rounded-xl font-semibold flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit Project
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;