import axios, { AxiosError, HttpStatusCode } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { store } from '../store';
import {setAccessToken,logout } from '../store/slices/authSlice';
import { APP_MESSAGES } from '../shared/constants/messages';

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  access_token: string;
}

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials:true,
    headers: {'Content-Type': 'application/json'},
});

apiClient.interceptors.request.use(config =>{
    const token = store.getState().auth.accessToken;

    console.log('Interceptor: token from store:', token);

    if(token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    response =>response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        if(error.response?.status === HttpStatusCode.Unauthorized && originalRequest && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
            originalRequest._retry = true;
            try {

                const refreshResponse = await apiClient.post<RefreshResponse>('/auth/refresh');

                const newToken = refreshResponse.data?.access_token;

                if(!newToken) throw new Error(APP_MESSAGES.AUTH.REFRESH_TOKEN_MISSING);

                store.dispatch(setAccessToken(newToken));

                if(originalRequest.headers) originalRequest.headers.Authorization = `Bearer ${newToken}`;

                return apiClient(originalRequest);
               
            } catch (refreshError) {
                if(refreshError instanceof AxiosError && (refreshError.response?.status===HttpStatusCode.Forbidden || refreshError.response?.status===HttpStatusCode.Unauthorized)){
                    store.dispatch(logout());
                }
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
