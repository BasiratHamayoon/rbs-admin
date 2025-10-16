import axios from 'axios';

// ✅ Use NEXT_PUBLIC_API_URL for Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('🔗 API Base URL:', API_BASE_URL); // Debug log

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    // ✅ Only run on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Only run on client side and don't redirect to /admin/login
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      // ✅ Redirect to /login instead of /admin/login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const adminAPI = {
  login: (username, password) => 
    api.post('/admin/login', { username, password }),

  getProfile: () => 
    api.get('/admin/profile'),

  changePassword: (data) => 
    api.patch('/admin/change-password', data),

  updateProfile: (data) => 
    api.patch('/admin/profile', data),
};

export const projectAPI = {
  getAll: (params) => 
    api.get('/projects', { params }),

  getById: (id) => 
    api.get(`/projects/${id}`),

  create: (formData) => 
    api.post('/projects', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  update: (id, formData) => 
    api.patch(`/projects/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),

  delete: (id) => 
    api.delete(`/projects/${id}`),

  getCategories: () => 
    api.get('/projects/categories'),
};

export const enquiryAPI = {
  getAll: (params) => 
    api.get('/enquiries', { params }),

  getStats: () => 
    api.get('/enquiries/stats'),

  update: (id, data) => 
    api.patch(`/enquiries/${id}`, data),

  delete: (id) => 
    api.delete(`/enquiries/${id}`),
};

export const quoteAPI = {
  getAll: () => 
    api.get('/quotes'),

  delete: (id) => 
    api.delete(`/quotes/${id}`),
};

export default api;