import Cookies from 'js-cookie';

export const setAuth = (token, admin, remember = false) => {
  const expires = remember ? 30 : 10;
  Cookies.set('admin_token', token, { expires });
  Cookies.set('admin_data', JSON.stringify(admin), { expires });
};

export const getAuth = () => {
  const token = Cookies.get('admin_token');
  const data = Cookies.get('admin_data');
  return { token, admin: data ? JSON.parse(data) : null };
};

export const clearAuth = () => {
  Cookies.remove('admin_token');
  Cookies.remove('admin_data');
};

export const isAuthenticated = () => !!Cookies.get('admin_token');