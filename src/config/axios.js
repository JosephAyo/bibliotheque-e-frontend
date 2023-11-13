import axiosConfig from 'axios';

axiosConfig.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axiosConfig.defaults.headers.patch['Content-Type'] = 'application/json';
axiosConfig.defaults.headers.put['Content-Type'] = 'application/json';

const UNAUTHORIZED = 401;
axiosConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    const { status } = error.response;
    if (status === UNAUTHORIZED) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  localStorage.setItem('token', `Bearer ${token}`);
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getAuthToken = () => {
  const AUTH_TOKEN = localStorage.getItem('token');
  return AUTH_TOKEN;
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  }
  return null;
};

export const checkIsSignedIn = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const AUTH_TOKEN = localStorage.getItem('token');
  if (user && AUTH_TOKEN) return true;
  return false;
};

export const clearToken = () => {
  localStorage.removeItem('token');
};
export const clearUser = () => {
  localStorage.removeItem('user');
};

export const clearAllUserData = () => {
  clearUser();
  clearToken();
};
export const axios = axiosConfig;
