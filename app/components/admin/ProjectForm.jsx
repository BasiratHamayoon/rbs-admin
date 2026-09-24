"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, Plus, Info, Layers, Image as ImageIcon, Settings, Star } from 'lucide-react';
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
  const [existingImages, setExistingImages] = useState(project?.images || []);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTechnology = (index) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }));
      setFeatureInput('');
    }
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === 'technologies' || key === 'features') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (key === 'featured') {
          submitData.append(key, formData[key].toString());
        } else {
          submitData.append(key, formData[key]);
        }
      });

      images.forEach((image) => {
        submitData.append('images', image);
      });

      if (project) {
        submitData.append('existingImages', JSON.stringify(existingImages));
        await projectAPI.update(project._id, submitData);
      } else {
        await projectAPI.create(submitData);
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving project:', error);
      alert(`Error saving project: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 rounded-xl p-5 border border-[#001C73]/20">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#001C73]/15">
          <div className="w-8 h-8 bg-[#001C73] rounded-lg flex items-center justify-center">
            <Info className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold text-[#001C73] uppercase tracking-wide">
            Basic Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#001C73] mb-2">
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#001C73]/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent text-gray-900 placeholder-gray-400 bg-white transition-all"
              placeholder="e.g., Modern Villa Construction"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#001C73] mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#001C73]/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent text-gray-900 bg-white transition-all"
            >
              <option value="">Select a category</option>
              {PROJECT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-[#001C73] mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 border border-[#001C73]/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent resize-none text-gray-900 placeholder-gray-400 bg-white transition-all"
            placeholder="Describe the project in detail..."
          />
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-5 border border-[#001C73]/20">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#001C73]/15">
          <div className="w-8 h-8 bg-[#001C73] rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold text-[#001C73] uppercase tracking-wide">
            Project Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-[#001C73] mb-2">
              Duration <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#001C73]/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent text-gray-900 placeholder-gray-400 bg-white transition-all"
              placeholder="e.g., 6 months"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#001C73] mb-2">
              Size <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="size"
              value={formData.size}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#001C73]/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent text-gray-900 placeholder-gray-400 bg-white transition-all"
              placeholder="e.g., 2500 sq ft"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#001C73] mb-2">
              Completion Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="completionDate"
              value={formData.completionDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#001C73]/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent text-gray-900 bg-white transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-semibold text-[#001C73] mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#001C73]/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent text-gray-900 placeholder-gray-400 bg-white transition-all"
              placeholder="e.g., Riyadh, Saudi Arabia"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#001C73] mb-2">
              Client <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="client"
              value={formData.client}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-[#001C73]/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent text-gray-900 placeholder-gray-400 bg-white transition-all"
              placeholder="e.g., ABC Corporation"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-5 border border-[#001C73]/20">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#001C73]/15">
          <div className="w-8 h-8 bg-[#001C73] rounded-lg flex items-center justify-center">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold text-[#001C73] uppercase tracking-wide">
            Technologies & Features
          </h3>
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-[#001C73] mb-2">
            Technologies Used
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
              className="flex-1 px-4 py-3 border border-[#001C73]/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent text-gray-900 placeholder-gray-400 bg-white"
              placeholder="e.g., Concrete, Steel Frame"
            />
            <Button
              type="button"
              onClick={addTechnology}
              className="bg-[#001C73] hover:bg-[#001255] text-white px-5 rounded-lg flex items-center gap-1 font-semibold"
            >
              <Plus size={18} />
              Add
            </Button>
          </div>
          {formData.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#001C73] text-white rounded-full text-sm font-medium shadow-sm"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(index)}
                    className="hover:bg-white/25 rounded-full p-0.5 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#001C73] mb-2">
            Key Features
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              className="flex-1 px-4 py-3 border border-[#001C73]/25 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#001C73] focus:border-transparent text-gray-900 placeholder-gray-400 bg-white"
              placeholder="e.g., Swimming Pool, Garden"
            />
            <Button
              type="button"
              onClick={addFeature}
              className="bg-[#001C73] hover:bg-[#001255] text-white px-5 rounded-lg flex items-center gap-1 font-semibold"
            >
              <Plus size={18} />
              Add
            </Button>
          </div>
          {formData.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#001C73] text-white rounded-full text-sm font-medium shadow-sm"
                >
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="hover:bg-white/25 rounded-full p-0.5 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-5 border border-[#001C73]/20">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#001C73]/15">
          <div className="w-8 h-8 bg-[#001C73] rounded-lg flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold text-[#001C73] uppercase tracking-wide">
            Project Images
          </h3>
        </div>

        <label
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#001C73]/40 rounded-xl cursor-pointer bg-white hover:bg-blue-50 hover:border-[#001C73] transition-all"
        >
          <div className="w-12 h-12 bg-[#001C73] rounded-full flex items-center justify-center mb-3">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <p className="text-sm text-[#001C73] font-bold">Click to upload multiple images</p>
          <p className="text-xs text-gray-500 mt-1">PNG, JPG, WEBP (Max 10MB each)</p>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {existingImages.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-bold text-[#001C73] mb-3">
              Current Images ({existingImages.length}):
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {existingImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.url}
                    alt={`Existing ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg shadow-md border-2 border-[#001C73]/20"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {imagePreviews.length > 0 && (
          <div className="mt-5">
            <p className="text-sm font-bold text-[#001C73] mb-3">
              New Images ({imagePreviews.length}):
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg shadow-md border-2 border-[#001C73]"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-xl p-5 border border-[#001C73]/20">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-5 h-5 text-[#001C73] border-[#001C73]/30 rounded focus:ring-[#001C73] accent-[#001C73]"
          />
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#001C73]" />
            <div>
              <span className="text-sm font-bold text-[#001C73]">Mark as Featured Project</span>
              <p className="text-xs text-gray-600 mt-0.5">
                Featured projects will be highlighted on the homepage
              </p>
            </div>
          </div>
        </label>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-[#001C73]/15">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 border-2 border-[#001C73]/30 text-[#001C73] hover:bg-blue-50 rounded-xl font-semibold transition-all"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
          className="px-6 py-3 bg-[#001C73] hover:bg-[#001255] text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
        >
          {loading ? 'Saving...' : project ? 'Update Project' : 'Create Project'}
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;