import axiosConfig from 'axios';

axiosConfig.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axiosConfig.defaults.headers.patch['Content-Type'] = 'application/json';
axiosConfig.defaults.headers.put['Content-Type'] = 'application/json';
axiosConfig.defaults.headers['ngrok-skip-browser-warning'] = 'any-value';

// const UNAUTHORIZED = 401;
// axiosConfig.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const { status } = error.response;
//     if (status === UNAUTHORIZED) {
//       if (typeof window !== 'undefined') {
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export const setAuthToken = (token) => {
  localStorage.setItem('token', `Bearer ${token}`);
};

export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const setStoredRoleId = (role_id) => {
  localStorage.setItem('role_id', role_id);
};

export const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const AUTH_TOKEN = localStorage.getItem('token');
    return AUTH_TOKEN;
  }
  return null;
};

export const getUser = () => {
  if (typeof window !== 'undefined') {
    const user = JSON.parse(localStorage.getItem('user'));
    return user;
  }
  return null;
};

export const getStoredRoleId = () => {
  if (typeof window !== 'undefined') {
    const role_id = localStorage.getItem('role_id');
    return role_id;
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

export const clearStoredRoleId = () => {
  localStorage.removeItem('role_id');
};

export const clearAllUserData = () => {
  clearStoredRoleId();
  clearUser();
  clearToken();
};
export const axios = axiosConfig;
