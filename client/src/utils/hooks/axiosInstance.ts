import axios from 'axios';

const axiosInstance: any = axios.create({
  baseURL: process.env.BASE_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor to dynamically set Authorization header before each request
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const userProfile = JSON.parse(localStorage.getItem('user-info')) || {};
//     const token = userProfile?.token;
//     const token = JSON.parse(localStorage.getItem('token')) || {};

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

export default axiosInstance;
