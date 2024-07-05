import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface InternalAxiosRequestConfig extends AxiosRequestConfig {
  headers: any; 
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'https://rickandmortyapi.com', 
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
