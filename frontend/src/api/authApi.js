import axios from 'axios';

const BASE = '/api';

export const getMe = () => axios.get(`${BASE}/auth/me`);
export const login = (username, password) => axios.post(`${BASE}/auth/login`, { username, password });
export const logout = () => axios.post(`${BASE}/auth/logout`);
export const changePassword = (currentPassword, newPassword) =>
  axios.put(`${BASE}/auth/password`, { currentPassword, newPassword });

export const listUsers = () => axios.get(`${BASE}/users`);
export const createUser = (data) => axios.post(`${BASE}/users`, data);
export const updateUser = (id, data) => axios.put(`${BASE}/users/${id}`, data);
export const deleteUser = (id) => axios.delete(`${BASE}/users/${id}`);

// Any 401 from the API (expired/revoked session) sends the app back to the login screen.
export const onUnauthorized = (handler) => {
  const id = axios.interceptors.response.use(
    res => res,
    err => {
      const url = err.config?.url || '';
      if (err.response?.status === 401 && !url.endsWith('/auth/login')) handler();
      return Promise.reject(err);
    }
  );
  return () => axios.interceptors.response.eject(id);
};
