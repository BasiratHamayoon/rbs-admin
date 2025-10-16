import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/ui/Button';
import { PROJECT_CATEGORIES } from '../../utils/constants';
import { projectAPI } from '../../services/api';

const ProjectForm = ({ project, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: project?.title || '',
    category: project?.category || '',
    description: project?.description || '',
    duration: project?.duration || '',
    size: project?.size || '',
    location: project?.location || '',
    client: project?.client || '',
    completionDate: project?.completionDate ? project.completionDate.split('T')[0] : '',
    technologies: project?.technologies || [],
    features: project?.features || [],
    status: project?.status || 'completed',
    featured: project?.featured || false
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (index) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'technologies' || key === 'features') {
          // Convert arrays to JSON strings
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'featured') {
          // Convert boolean to string
          submitData.append(key, formData[key].toString());
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add images only if there are new ones
      images.forEach(image => {
        submitData.append('images', image);
      });

      console.log('Submitting project data:', {
        ...formData,
        imagesCount: images.length
      });

      if (project) {
        // Update existing project
        await projectAPI.update(project._id, submitData);
        console.log('Project updated successfully');
      } else {
        // Create new project
        await projectAPI.create(submitData);
        console.log('Project created successfully');
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving project:', error);
      console.error('Error details:', error.response?.data);
      alert(`Error saving project: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Project Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent placeholder-gray-700 text-gray-900"
            placeholder="e.g., Modern Villa Construction"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent text-gray-900 bg-white"
          >
            <option value="" className="text-gray-700">Select a category</option>
            {PROJECT_CATEGORIES.map(category => (
              <option key={category} value={category} className="text-gray-900">
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent resize-none placeholder-gray-700 text-gray-900"
          placeholder="Describe the project in detail including scope, challenges, and solutions..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Duration *
          </label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent placeholder-gray-700 text-gray-900"
            placeholder="e.g., 6 months, 12 weeks"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Size *
          </label>
          <input
            type="text"
            name="size"
            value={formData.size}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent placeholder-gray-700 text-gray-900"
            placeholder="e.g., 2500 sq ft, 500 sq meters"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Completion Date *
          </label>
          <input
            type="date"
            name="completionDate"
            value={formData.completionDate}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent text-gray-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Location *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent placeholder-gray-700 text-gray-900"
            placeholder="e.g., Downtown Toronto, ON"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Client *
          </label>
          <input
            type="text"
            name="client"
            value={formData.client}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent placeholder-gray-700 text-gray-900"
            placeholder="e.g., ABC Corporation, John Smith"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Technologies Used
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent placeholder-gray-700 text-gray-900"
            placeholder="e.g., Concrete, Steel Frame, Smart Home"
          />
          <Button type="button" onClick={addTechnology}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.technologies.map((tech, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {tech}
              <button
                type="button"
                onClick={() => removeTechnology(index)}
                className="text-blue-600 hover:text-blue-800 text-sm font-bold ml-1 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Key Features
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={featureInput}
            onChange={(e) => setFeatureInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent placeholder-gray-700 text-gray-900"
            placeholder="e.g., Swimming Pool, Garden, Garage"
          />
          <Button type="button" onClick={addFeature}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.features.map((feature, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              {feature}
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="text-blue-600 hover:text-blue-800 text-sm font-bold ml-1 transition-colors"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-800 mb-2">
          Project Images
        </label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#001C73] file:text-white hover:file:bg-[#001255] text-gray-900"
        />
        <p className="text-sm text-gray-700 mt-2">
          Select multiple high-quality images showcasing the project (JPEG, PNG, WebP)
        </p>
        {images.length > 0 && (
          <p className="text-sm text-blue-600 font-medium mt-1">
            {images.length} image(s) selected
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 text-[#001C73] border-gray-300 rounded focus:ring-[#001C73]"
          />
          <span className="text-sm font-medium text-gray-800">
            Mark as featured project
          </span>
        </label>
      </div>

      <div className="flex gap-4 justify-end pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          className="text-gray-700 border-gray-300 hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          className="bg-[#001C73] hover:bg-[#001255] text-white"
        >
          {project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;