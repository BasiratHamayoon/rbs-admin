import axios from 'axios';

// Ensure no trailing slash
const rawBaseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const API_BASE_URL = rawBaseURL.replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('adminToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration safely
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined') {
      const isLoginRequest = error.config?.url?.includes('/admin/login');

      // Only redirect on 401 if it's NOT the login page itself
      if (error.response?.status === 401 && !isLoginRequest) {
        localStorage.removeItem('adminToken');
        window.location.href = '/login';
      }
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