import axios, { AxiosError, HttpStatusCode } from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response, 
  (error: AxiosError) => {
    if (error.response?.status === HttpStatusCode.Unauthorized) {
      store.dispatch(logout());
    }

    if (error.response?.status === HttpStatusCode.Forbidden) {
      console.warn('Access forbidden: insufficient permissions');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
