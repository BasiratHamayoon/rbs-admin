import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = Cookies.get('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const locale = Cookies.get('NEXT_LOCALE') || 'en';
  config.headers['Accept-Language'] = locale;

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('admin_token');
      Cookies.remove('admin_data');
      if (typeof window !== 'undefined') {
        const locale = window.location.pathname.split('/')[1] || 'en';
        window.location.href = `/${locale}/login`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;