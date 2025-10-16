import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Folder } from 'lucide-react';
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

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      console.log('Projects API response:', response); // Debug log
      
      // Handle different possible response structures
      const projectsData = 
        response?.data?.data?.projects || 
        response?.data?.projects || 
        response?.data || 
        [];
      
      console.log('Processed projects data:', projectsData);
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
        setProjects(projects.filter(project => project._id !== id));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  const handleFormSuccess = () => {
    fetchProjects();
    handleFormClose();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#001C73] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Safe check before rendering
  const safeProjects = Array.isArray(projects) ? projects : [];

  return (
    <div className="flex-1">
      <Header 
        title="Projects" 
        subtitle="Manage your construction projects"
      />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Projects</h2>
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            Add Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {safeProjects.map((project, index) => (
            <motion.div
              key={project._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
            >
              {project.images && project.images.length > 0 && (
                <img
                  src={project.images[0].url}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg text-gray-900 truncate">
                    {project.title}
                  </h3>
                  <span className="px-2 py-1 bg-[#001C73] text-white text-xs rounded-full">
                    {project.category}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>{project.duration}</span>
                  <span>{project.size}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-1"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit size={16} />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    className="flex items-center bg-blue-900 cursor-pointer justify-center gap-1"
                    onClick={() => handleDelete(project._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {safeProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              <Folder size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Projects Yet
            </h3>
            <p className="text-gray-600 mb-4">
              Get started by adding your first construction project.
            </p>
            <Button 
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Add First Project
            </Button>
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
    </div>
  );
};

export default Projects;