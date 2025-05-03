import useAuthStore from '@/hooks/authStore';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const store = useAuthStore.getState();
    if (store.accessToken) {
      config.headers.Authorization = `Bearer ${store.accessToken}`;
    }
    return config;
  }, 
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const {refreshToken} = useAuthStore.getState();
        
        if (refreshToken) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`, 
            {refreshToken}
          );

          if (response.data && response.data.accessToken) {
            useAuthStore.getState().setUser({
              accessToken: response.data.accessToken
            });
            
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            } else {
              originalRequest.headers = { Authorization: `Bearer ${response.data.accessToken}` };
            }
            
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // useAuthStore.getState().clearUser();
        // return Promise.reject(refreshError);
        console.log(`req gagal ${refreshError}`)
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;